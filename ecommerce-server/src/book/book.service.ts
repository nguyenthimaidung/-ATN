import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LessThan, Like, Repository } from 'typeorm'

import { Book } from './book.entity'
import { CreateBookDto, FindBookDto, UpdateBookDto, SortBookBy, AdminFindBookDto } from './book.dto'
import { Errors } from '../share/error.code'
import { dataFeild, paginationFeild } from '../share/common'
import { Category } from '../category/category.entity'
import { Author } from '../author/author.entity'

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Author)
    private readonly authorRepo: Repository<Author>,
  ) {}

  public async isExists(id: number, throwError?: any) {
    const count = await this.bookRepo.count({ where: { id } })
    if (count === 0 && throwError) {
      throw throwError
    }
    return count > 0
  }

  public async create(createBookDto: CreateBookDto) {
    const { authorIds, categoryIds, ...data } = createBookDto
    const book = Object.assign(new Book(), data)
    const saved = await this.bookRepo.save(book)
    if (categoryIds && categoryIds.length !== 0) {
      const ids = categoryIds.map((i) => i.id)
      const categories = await this.categoryRepo.findByIds(ids)
      await this.addCategories(saved.id, categories)
    }
    if (authorIds && authorIds.length !== 0) {
      const ids = authorIds.map((i) => i.id)
      const categories = await this.authorRepo.findByIds(ids)
      await this.addAuthors(saved.id, categories)
    }
    return await this.bookRepo.findOne({ where: { id: saved.id }, relations: ['authors', 'categories'] })
  }

  public async update(id: number, updateBookDto: UpdateBookDto) {
    const { authorIds, categoryIds, ...data } = updateBookDto
    await this.isExists(id, new NotFoundException(Errors.notExists('Book')))
    const book = await this.bookRepo.findOne({
      where: { id },
      relations: ['authors', 'categories'],
      loadRelationIds: true,
    })
    await this.bookRepo.update(id, data)

    if (categoryIds && categoryIds.length !== 0) {
      const ids = categoryIds.map((i) => i.id)
      const categories = await this.categoryRepo.findByIds(ids)
      await this.updateCategories(id, categories, book.categories)
    }
    if (authorIds && authorIds.length !== 0) {
      const ids = authorIds.map((i) => i.id)
      const authors = await this.authorRepo.findByIds(ids)
      await this.updateAuthors(id, authors, book.authors)
    }
    return await this.bookRepo.findOne({ where: { id }, relations: ['authors', 'categories'] })
  }

  public async delete(id: number) {
    await this.bookRepo.softDelete(id)
  }

  public async get(id) {
    await this.isExists(id, new NotFoundException(Errors.notExists('Book')))
    return await this.bookRepo.findOne({ where: { id }, relations: ['authors', 'categories'] })
  }

  public async getRandoms(id: number, take?: number) {
    take = take || 5
    return await this.bookRepo
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.categories', 'category')
      .leftJoinAndSelect('book.authors', 'author')
      .orderBy('RAND()')
      .take(take)
      .getMany()
  }

  public async getAll(findInfo: FindBookDto, page?: number, take?: number) {
    page = page || 0
    take = take || 20

    const { authorIds, categoryIds, name, maxPrice, minPrice, isDiscounting, sortBy } = findInfo

    let query = this.bookRepo.createQueryBuilder('book')

    if (name !== undefined) query = query.where('book.name LIKE :name', { name: `%${name}%` })
    if (minPrice !== undefined) query = query.andWhere('book.price >= :minPrice', { minPrice: minPrice })
    if (maxPrice !== undefined) query = query.andWhere('book.price <= :maxPrice', { maxPrice: maxPrice })
    if (isDiscounting) {
      query = query
        .andWhere('book.discount > 0')
        .andWhere('book.discountBegin <= :now', { now: new Date() })
        .andWhere('book.discountEnd >= :now', { now: new Date() })
    }

    if (categoryIds && categoryIds.length > 0)
      query = query.innerJoin('book.categories', 'category_temp', 'category_temp.id IN (:categoryIds)', {
        categoryIds: categoryIds.map((item) => item.id),
      })

    if (authorIds && authorIds.length > 0)
      query = query.innerJoin('book.authors', 'author_temp', 'author_temp.id IN (:authorIds)', {
        authorIds: authorIds.map((item) => item.id),
      })

    query = query
      .leftJoinAndSelect('book.categories', 'category')
      .leftJoinAndSelect('book.authors', 'author')
      .skip(page * take)
      .take(take)

    switch (sortBy) {
      case SortBookBy.POPULAR:
        query = query.orderBy('book.viewCount', 'DESC')
        break
      case SortBookBy.BEST_RATE:
        query = query.orderBy('book.rateAvg', 'DESC')
        break
      case SortBookBy.BEST_SELLERS:
        query = query.orderBy('book.quantitySold', 'DESC')
        break
      case SortBookBy.PRICE_DECREASE:
        query = query.orderBy('book.price', 'DESC')
        break
      case SortBookBy.PRICE_INCREASE:
        query = query.orderBy('book.price', 'ASC')
        break
    }

    query = query.addOrderBy('book.createdAt', 'DESC')

    const [data, total] = await query.getManyAndCount()

    const result = {}
    result[dataFeild] = data
    result[paginationFeild] = { total, page, take }

    return result
  }

  public async adminGets() {
    const [data, total] = await this.bookRepo.findAndCount({ select: ['id', 'name', 'isbn', 'quantity'] })
    const result = {}
    result[dataFeild] = data
    result[paginationFeild] = { total, page: 0, take: total }

    return result
  }

  public async adminGetAll(findInfo: AdminFindBookDto, page?: number, take?: number) {
    page = page || 0
    take = take || 20

    const { authorIds, categoryIds, search, maxPrice, minPrice, isDiscounting, sortBy } = findInfo

    let query = this.bookRepo.createQueryBuilder('book')

    if (search !== undefined) {
      if (search.startsWith('#')) {
        const id = +search.split('#').join('')
        if (!Number.isNaN(id) && Number.isInteger(id)) {
          query = query.where('book.id = :id', { id: id })
        }
      } else {
        query = query.where('(book.name LIKE :name OR book.isbn = :isbn)', {
          name: `%${search}%`,
          isbn: search,
        })
      }
    }

    if (minPrice !== undefined) query = query.andWhere('book.price >= :minPrice', { minPrice: minPrice })
    if (maxPrice !== undefined) query = query.andWhere('book.price <= :maxPrice', { maxPrice: maxPrice })
    if (isDiscounting) {
      query = query
        .andWhere('book.discount > 0')
        .andWhere('book.discountBegin <= :now', { now: new Date() })
        .andWhere('book.discountEnd >= :now', { now: new Date() })
    }

    if (categoryIds && categoryIds.length > 0)
      query = query.innerJoin('book.categories', 'category_temp', 'category_temp.id IN (:categoryIds)', {
        categoryIds: categoryIds.map((item) => item.id),
      })

    if (authorIds && authorIds.length > 0)
      query = query.innerJoin('book.authors', 'author_temp', 'author_temp.id IN (:authorIds)', {
        authorIds: authorIds.map((item) => item.id),
      })

    query = query
      .leftJoinAndSelect('book.categories', 'category')
      .leftJoinAndSelect('book.authors', 'author')
      .skip(page * take)
      .take(take)

    switch (sortBy) {
      case SortBookBy.POPULAR:
        query = query.orderBy('book.viewCount', 'DESC')
        break
      case SortBookBy.BEST_RATE:
        query = query.orderBy('book.rateAvg', 'DESC')
        break
      case SortBookBy.BEST_SELLERS:
        query = query.orderBy('book.quantitySold', 'DESC')
        break
      case SortBookBy.PRICE_DECREASE:
        query = query.orderBy('book.price', 'DESC')
        break
      case SortBookBy.PRICE_INCREASE:
        query = query.orderBy('book.price', 'ASC')
        break
    }

    query = query.addOrderBy('book.createdAt', 'DESC')

    const [data, total] = await query.getManyAndCount()

    const result = {}
    result[dataFeild] = data
    result[paginationFeild] = { total, page, take }

    return result
  }

  public async addCategories(bookId: number, categoryIds: number[] | Category[]) {
    await this.bookRepo.createQueryBuilder().relation('categories').of(bookId).add(categoryIds)
  }

  public async updateCategories(
    bookId: number,
    addCategoryIds: number[] | Category[],
    removeCategoryIds: number[] | Category[],
  ) {
    await this.bookRepo
      .createQueryBuilder()
      .relation('categories')
      .of(bookId)
      .addAndRemove(addCategoryIds, removeCategoryIds)
  }

  public async addAuthors(bookId: number, authorIds: number[] | Author[]) {
    await this.bookRepo.createQueryBuilder().relation('authors').of(bookId).add(authorIds)
  }

  public async updateAuthors(bookId: number, addAuthorIds: number[] | Author[], removeAuthorIds: number[] | Author[]) {
    await this.bookRepo.createQueryBuilder().relation('authors').of(bookId).addAndRemove(addAuthorIds, removeAuthorIds)
  }

  public toBookInfoInfos(categories: Book[]) {
    return categories.map((item) => {
      return this.toBookInfoInfo(item)
    })
  }

  public toBookInfoInfo(book: Book) {
    const { createdAt, updatedAt, deleteAt, ...bookInfo } = book
    return bookInfo
  }
}
