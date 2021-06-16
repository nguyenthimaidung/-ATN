import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateAccountDto, FindAccountDto } from '../account/account.dto'
import { Account } from '../account/account.entity'
import { In, Repository } from 'typeorm'

import { User } from './user.entity'
import { CartDetailDto, UpdateUserProfileDto } from './user.dto'
import { Errors } from '../share/error.code'
import { Book } from '../book/book.entity'
import { CartDetail } from './cart-detail.entity'
import { Logger } from '../share/logger.util'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
    @InjectRepository(CartDetail)
    private readonly cartDetailRepo: Repository<CartDetail>,
  ) {}

  public async getPublicInfo(id: string) {
    return this.userRepo
      .findOneOrFail({ id })
      .catch(() => {
        throw new NotFoundException()
      })
      .then((user) => this.toPublicInfo(user))
  }

  public async create(createAccountDto: CreateAccountDto, account: Account) {
    const existedUser = await this.userRepo.findOne({
      id: account.id,
    })
    if (existedUser) {
      throw new ConflictException(Errors.CONFLICT_EMAIL)
    }

    const user = new User()
    user.id = account.id
    user.name = createAccountDto.name
    user.email = account.email

    return this.toPublicInfo(await this.userRepo.save(user))
  }

  private async isExists(id: string, throwError?: any) {
    const count = await this.userRepo.count({ where: { id } })
    if (count === 0 && throwError) {
      throw throwError
    }
    return count > 0
  }

  public async get(user: User | string) {
    if (!(user instanceof User)) {
      const id = user
      user = await await this.userRepo.findOne({ id })
    }
    if (!user) {
      throw new NotFoundException(Errors.notExists('User'))
    }
    return user
  }

  public async getProfile(id) {
    const existedUser = await this.get(id)
    return this.toProfileInfo(existedUser)
  }

  public async updateProfile(id, updateUserProfileDto: UpdateUserProfileDto | { avatar: string }) {
    await this.isExists(id, new NotFoundException(Errors.notExists('User')))
    await this.userRepo.update(id, updateUserProfileDto)
    return this.toProfileInfo(await this.userRepo.findOne({ id }))
  }

  private toPublicInfo(user: User) {
    const { createdAt, updatedAt, deleteAt, phone, email, address, ...publicInfo } = user
    return publicInfo
  }

  private toProfileInfo(user: User) {
    const { createdAt, updatedAt, deleteAt, ...profileInfo } = user
    return profileInfo
  }

  public async getWishlist(userId: string) {
    await this.isExists(userId, new NotFoundException(Errors.notExists('User')))
    return await this.userRepo.createQueryBuilder().relation('wishlist').of(userId).loadMany()
  }

  public async updateWishlist(userId: string, bookIds: number[]) {
    await this.isExists(userId, new NotFoundException(Errors.notExists('User')))
    const books = await this.bookRepo.findByIds(bookIds)
    const wishlist = await this.userRepo.createQueryBuilder().relation('wishlist').of(userId).loadMany()
    this.userRepo.createQueryBuilder().relation('wishlist').of(userId).addAndRemove(books, wishlist)
    return books
  }

  private getDiscountBook(book: Book) {
    if (!book) {
      return 0
    }
    let discount = 0
    if (book.discount && book.discountBegin && book.discountEnd) {
      const beginDate = new Date(book.discountBegin)
      const endDate = new Date(book.discountEnd)
      if (Date.now() >= beginDate.getTime() && Date.now() <= endDate.getTime()) {
        discount = book.discount
      }
    }
    return discount
  }

  public async getCart(userId: string) {
    await this.isExists(userId, new NotFoundException(Errors.notExists('User')))
    const data = await this.cartDetailRepo.find({ where: { userId }, relations: ['book'] })
    const cartDetail = data
      .filter((detail) => detail.quantity <= detail.book.quantity)
      .map((detail) => ({
        ...detail,
        subTotal: detail.quantity * (detail.book.price - this.getDiscountBook(detail.book)),
      }))
    return {
      detail: cartDetail,
      total: cartDetail.reduce((prev, cur) => prev + cur.subTotal, 0),
    }
  }

  public async updateCart(userId: string, cartDetails: CartDetailDto[]) {
    userId && (await this.isExists(userId, new NotFoundException(Errors.notExists('User'))))
    const addBooks = await this.bookRepo.findByIds(cartDetails.map((item) => item.bookId))

    const details: CartDetail[] = cartDetails.reduce((prev, item) => {
      const book = addBooks.find((book) => book.id === item.bookId)
      if (book) {
        if (item.quantity > book.quantity) {
          // throw new BadRequestException(Errors.NOT_ENOUGHT_BOOK(book.name))
        } else {
          prev.push(
            Object.assign(new CartDetail(), {
              userId: userId,
              bookId: item.bookId,
              book: book,
              quantity: item.quantity,
            }),
          )
        }
      }
      return prev
    }, [])

    if (!userId) {
      const cartDetail = details.map((detail) => ({
        ...detail,
        subTotal: detail.quantity * (detail.book.price - this.getDiscountBook(detail.book)),
      }))
      return {
        detail: cartDetail,
        total: cartDetail.reduce((prev, cur) => prev + cur.subTotal, 0),
      }
    }

    await this.cartDetailRepo.delete({ userId: userId })
    await this.cartDetailRepo.save(details)
    return await this.getCart(userId)
  }

  public async getAll(findInfo: FindAccountDto, page?: number, take?: number) {
    page = page || 0
    take = take || 20
    const { search, state } = findInfo

    let query = this.userRepo.createQueryBuilder('user')

    if (search !== undefined) {
      query = query.where('(user.name LIKE :name OR user.phone LIKE :phone OR user.email LIKE :email)', {
        name: `%${search}%`,
        phone: `%${search}%`,
        email: `%${search}%`,
      })
    }

    query = query.leftJoinAndSelect('user.account', 'account')

    if (state !== undefined) query = query.andWhere('account.state = :state', { state: state })

    query = query.skip(page * take).take(take)

    return await query.getManyAndCount()
  }
}
