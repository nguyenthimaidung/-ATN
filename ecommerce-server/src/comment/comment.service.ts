import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Comment } from './comment.entity'
import { CreateCommentDto, ReplyCommentDto } from './comment.dto'
import { BookRate } from './book-rate.entity'
import { Book } from '../book/book.entity'
import { BookService } from '../book/book.service'
import { Errors } from '../share/error.code'
import { dataFeild, paginationFeild } from '../share/common'
import { AccountService } from '../account/account.service'

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(BookRate)
    private readonly bookRateRepo: Repository<BookRate>,
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
    @Inject(BookService) private readonly bookService: BookService,
    @Inject(AccountService) private readonly accountService: AccountService,
  ) {}

  private async isExists(id: number, throwError?: any) {
    const count = await this.commentRepo.count({ where: { id } })
    if (count === 0 && throwError) {
      throw throwError
    }
    return count > 0
  }

  private async updateBookRateAgv(bookId: number) {
    const data = await this.bookRateRepo
      .createQueryBuilder('book_rate')
      .select('book_rate.bookId')
      .addSelect('SUM(book_rate.value)', 'sum')
      .addSelect('COUNT(book_rate.userId)', 'count')
      .where('book_rate.bookId = :bookId', { bookId: bookId })
      .groupBy('book_rate.bookId')
      .getRawOne()
    if (data.count !== 0) {
      const rateAvg = data.sum / data.count
      await this.bookRepo.update(bookId, { rateAvg: rateAvg, rateCount: data.count })
    }
  }

  private async updateBookViewCount(bookId: number) {
    const data = await this.commentRepo
      .createQueryBuilder('comment')
      .select('comment.bookId')
      .addSelect('COUNT(comment.id)', 'count')
      .where('comment.bookId = :bookId', { bookId: bookId })
      .andWhere('comment.parentId IS null')
      .groupBy('comment.bookId')
      .getRawOne()
    await this.bookRepo.update(bookId, { viewCount: data.count })
  }

  public async create(accountId: string | undefined, createCommentDto: CreateCommentDto) {
    const { name, email, phone, content, rate, bookId } = createCommentDto

    await this.bookService.isExists(bookId, new NotFoundException(Errors.notFound('Book')))

    const comment = new Comment()
    comment.bookId = bookId

    if (accountId) {
      // have rate
      if (!content && rate === undefined) {
        throw new BadRequestException('Content or rate is required')
      }
      if (rate !== undefined) {
        comment.rate = rate

        const bookRate = new BookRate()
        bookRate.userId = accountId
        bookRate.bookId = bookId
        bookRate.value = rate

        await this.bookRateRepo.save(bookRate)
        await this.updateBookRateAgv(bookId)
      }
      if (content) {
        comment.accountId = accountId
        comment.content = content
        await this.commentRepo.save(comment)
      }
    } else {
      // any user can comment
      if (!name) throw new BadRequestException('Name is required')
      if (!email) throw new BadRequestException('Email is required')
      if (!phone) throw new BadRequestException('Phone is required')
      if (!content) throw new BadRequestException('Content is required')

      comment.name = name
      comment.email = email
      comment.phone = phone
      comment.content = content

      await this.commentRepo.save(comment)
    }

    await this.updateBookViewCount(bookId)
    return await this.getCommentBookId(bookId)
  }

  public async reply(accountId: string, reply: ReplyCommentDto) {
    await this.isExists(reply.parentId, new NotFoundException(Errors.notFound('Comment')))
    const comment = new Comment()
    comment.accountId = accountId
    comment.content = reply.content
    comment.parentId = reply.parentId
    await this.commentRepo.save(comment)
  }

  public async getCommentBookId(bookId: number, page?: number, take?: number) {
    page = page || 0
    take = take || 20

    const [comments, total] = await this.commentRepo.findAndCount({
      where: { bookId: bookId, parentId: null },
      relations: ['child'],
      order: { createdAt: 'DESC' },
      skip: page * take,
      take,
    })

    const result = {}
    result[dataFeild] = await this.fillAccountInfo(comments)
    result[paginationFeild] = { total, page, take }

    return result
  }

  public async delete(id: number) {
    await this.commentRepo.softDelete(id)
  }

  private async fillAccountInfo(comments: Comment[]) {
    return await Promise.all(
      comments.map(async (item) => {
        if (item.child && item.child.length > 0) {
          item.child = await this.fillAccountInfo(item.child)
        }
        if (item.accountId) {
          const info = await this.accountService.getPublicInfo(item.accountId)
          return Object.assign(item, { info })
        }
        return item
      }),
    )
  }
}
