import { BadRequestException, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Connection, Repository } from 'typeorm'

import { Order } from './order.entity'
import { CreateOrderDto, FindOrderDto, UpdateOrderDto } from './order.dto'
import { Errors } from '../share/error.code'
import { OrderPayState, OrderPayType, OrderState, StatisticsBy } from './order.interface'
import { UserService } from '../user/user.service'
import { OrderDetail } from './order-detail.entity'
import { Book } from '../book/book.entity'
import { Logger } from '../share/logger.util'
import { dataFeild, paginationFeild } from '../share/common'
import { GmailService } from '../services/gmail.service'
import { Category } from '../category/category.entity'
import { AccountState, UserTypeEnum } from '../account/account.interfaces'
import moment = require('moment')

const TAG = 'OrderService'

@Injectable()
export class OrderService {
  constructor(
    private connection: Connection,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepo: Repository<OrderDetail>,
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @Inject(UserService) private readonly userService: UserService,
  ) {
    // this.statistics().then((val) => console.log(val))
    // this.statisticsRevenue(new Date('2021-01-01'), new Date('2021-06-01')).then((val) => console.log(val))
    // this.statisticsCommentedByMonth(new Date('2021-01-01'), new Date('2021-06-01')).then((val) => console.log(val))
    // this.statisticsOrderDoneByYear(new Date('2020-01-01'), new Date('2022-01-01')).then((val) => console.log(val))
  }

  public async getOrder(order: Order | number) {
    if (!(order instanceof Order)) {
      const id = order
      order = await await this.orderRepo.findOne({ where: { id }, relations: ['details'] })
    }
    if (!order) {
      throw new NotFoundException(Errors.notExists('Order'))
    }
    return order
  }

  public async isExists(id: number, throwError?: any) {
    const count = await this.orderRepo.count({ where: { id } })
    if (count === 0 && throwError) {
      throw throwError
    }
    return count > 0
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

  public async draftOrder(userId: string | undefined, createOrderDto: CreateOrderDto) {
    const deliveryFee = 0

    // caculate total price of order
    let totalOrder = 0
    const addBooks = await this.bookRepo.findByIds(createOrderDto.details.map((item) => item.bookId))
    const orderDetails = createOrderDto.details.reduce((prev: OrderDetail[], item) => {
      const book = addBooks.find((book) => book.id === item.bookId)
      if (book) {
        if (item.quantity > book.quantity) {
          throw new BadRequestException(Errors.NOT_ENOUGHT_BOOK(book.name))
        }
        const detail = new OrderDetail()
        detail.bookId = book.id
        detail.name = book.name
        detail.discount = this.getDiscountBook(book)
        detail.price = book.price
        detail.quantity = item.quantity
        detail.subTotal = (detail.price - detail.discount) * detail.quantity
        totalOrder += detail.subTotal
        prev.push(detail)
      }
      return prev
    }, [])

    // order info
    const user = userId ? await this.userService.get(userId) : undefined
    const draftOrder = userId
      ? await this.orderRepo.findOne({
          where: { user: user, state: OrderState.DRAFT },
        })
      : createOrderDto.id
      ? await this.orderRepo.findOne({
          where: { id: createOrderDto.id, userId: null, state: OrderState.DRAFT },
        })
      : undefined

    const order = draftOrder || new Order()

    order.name = createOrderDto.name
    order.phone = createOrderDto.phone
    order.email = createOrderDto.email
    order.address = createOrderDto.address
    order.note = createOrderDto.note
    order.payType = createOrderDto.payType
    order.payState = OrderPayState.NONE
    order.createdAt = new Date()
    order.deliveryFee = deliveryFee
    order.totalOrder = totalOrder + deliveryFee

    if (user) {
      order.userId = user.id
    }

    if (order.id) {
      await this.orderDetailRepo.delete({ orderId: draftOrder.id })
    }

    const saved = await this.orderRepo.save(order)
    await this.orderDetailRepo.save(
      orderDetails.map((item) => {
        item.orderId = saved.id
        return item
      }),
    )

    await this.sendVerifyCodeOrder(saved)

    return this.toOrderInfo(
      await this.orderRepo.findOne({
        where: { id: saved.id },
        relations: ['details'],
      }),
    )
  }

  public async decreaseBookQuantity(orderWithRelationDetails: Order) {
    const { details } = orderWithRelationDetails
    const mapBookIdQuantity = details.reduce((prev, cur) => {
      prev[cur.bookId] = cur.quantity
      return prev
    }, {})
    const books = await this.bookRepo.findByIds(details.map((item) => item.bookId))
    await Promise.all(
      books.map(async (book) => {
        book.quantity = book.quantity - mapBookIdQuantity[book.id]
        book.quantitySold = book.quantitySold + mapBookIdQuantity[book.id]
        await this.bookRepo.save(book)
      }),
    )
  }

  public async restoreBookQuantity(orderWithRelationDetails: Order) {
    const { details } = orderWithRelationDetails
    const mapBookIdQuantity = details.reduce((prev, cur) => {
      prev[cur.bookId] = cur.quantity
      return prev
    }, {})
    const books = await this.bookRepo.findByIds(details.map((item) => item.bookId))
    await Promise.all(
      books.map(async (book) => {
        book.quantity = book.quantity + mapBookIdQuantity[book.id]
        book.quantitySold = book.quantitySold - mapBookIdQuantity[book.id]
        await this.bookRepo.save(book)
      }),
    )
  }

  public async create(userId: string, orderId: number, verifyCode: string) {
    const draftOrder = await this.orderRepo.findOne({
      where: { userId: userId || null, id: orderId, state: OrderState.DRAFT },
      relations: ['details'],
    })

    if (!draftOrder) throw new NotFoundException(Errors.notExists('Order'))

    // verify email order of guests
    if (!userId) {
      if (draftOrder.verifyCode !== verifyCode) {
        throw new NotAcceptableException(Errors.VERIFY_CODE_INCORRECT)
      }
      if (!draftOrder.verifyCodeExp || draftOrder.verifyCodeExp.getTime() < Date.now()) {
        throw new NotAcceptableException(Errors.VERIFY_CODE_EXPIRED)
      }
    }

    if (userId) {
      this.userService.updateCart(userId, [])
    }

    draftOrder.state = OrderState.CREATE
    const saved = await this.orderRepo.save(draftOrder)

    // decrease book quantity
    if (draftOrder.payType === OrderPayType.CASH) {
      await this.decreaseBookQuantity(draftOrder)
    }

    return this.toOrderInfo(
      await this.orderRepo.findOne({
        where: { id: saved.id },
        relations: ['details'],
      }),
    )
  }

  public async update(id: number, updateOrderDto: UpdateOrderDto) {
    await this.isExists(id, new NotFoundException(Errors.notExists('Order')))
    await this.orderRepo.update(id, updateOrderDto)
    return this.toOrderInfo(await this.orderRepo.findOne({ where: { id: id }, relations: ['details'] }))
  }

  public async delete(id: number) {
    await this.orderRepo.softDelete(id)
  }

  public async sendVerifyCodeOrder(order: Order | number) {
    order = await this.getOrder(order)
    if (order.userId || order.state !== OrderState.DRAFT) {
      return
    }
    const verifyCode = await this.generateVerifyCodeOrder(order.id)

    GmailService.sendMail({
      from: `Book Ecommerce <${process.env.MAIL_ADDRESS}>`,
      to: order.email,
      subject: `Book Ecommerce Verify Order ${order.id}`,
      content: verifyCode.verifyCode,
    })

    Logger.info(TAG, 'sendVerifyCodeOrder', order.id, order.email, verifyCode)
  }

  public async generateVerifyCodeOrder(id) {
    const verifyInfo = {
      verifyCode: ('000000' + Math.floor(Math.random() * 999999)).slice(-6),
      verifyCodeExp: new Date(Date.now() + 3 * 60 * 1000),
    }

    await this.orderRepo.update(id, verifyInfo)

    return verifyInfo
  }

  public async getAll(findInfo: FindOrderDto, page?: number, take?: number) {
    page = page || 0
    take = take || 20
    const { userId, search, state, payState, payType, fromDate, toDate } = findInfo

    let query = this.orderRepo.createQueryBuilder('order')

    if (search !== undefined) {
      if (search.startsWith('#')) {
        const id = +search.split('#').join('')
        if (!Number.isNaN(id) && Number.isInteger(id)) {
          query = query.where('order.id = :id', { id: id })
        }
      } else {
        query = query.where('(order.name LIKE :name OR order.phone LIKE :phone OR order.email LIKE :email)', {
          name: `%${search}%`,
          phone: `%${search}%`,
          email: `%${search}%`,
        })
      }
    }

    if (userId) query = query.andWhere('order.userId = :userId', { userId: userId })

    if (state !== undefined) query = query.andWhere('order.state = :state', { state: state })
    if (payState !== undefined) query = query.andWhere('order.payState = :payState', { payState: payState })
    if (payType !== undefined) query = query.andWhere('order.payType = :payType', { payType: payType })

    if (fromDate !== undefined) query = query.andWhere('order.createdAt >= :fromDate', { fromDate: fromDate })
    if (toDate !== undefined) query = query.andWhere('order.createdAt <= :toDate', { toDate: toDate })

    query = query.andWhere('order.state <> :ignoreState', { ignoreState: OrderState.DRAFT })

    query = query
      .leftJoinAndSelect('order.details', 'orderdetail')
      .skip(page * take)
      .take(take)

    query = query.orderBy('order.state', 'ASC')
    query = query.addOrderBy('order.createdAt', 'DESC')

    const [data, total] = await query.getManyAndCount()

    const result = {}
    result[paginationFeild] = { total, page, take }
    result[dataFeild] = data

    return result
  }

  public async statisticsSoldBook(fromDate: Date, toDate: Date) {
    const orderDetailSold = this.orderDetailRepo
      .createQueryBuilder('orderdetail')
      .select('orderdetail.bookId', 'bookId')
      .addSelect('orderdetail.quantity', 'quantity')
      .innerJoin('orderdetail.order', 'order')
      .where('order.createdAt >= :fromDate', { fromDate: fromDate })
      .andWhere('order.createdAt <= :toDate', { toDate: toDate })
      .andWhere('order.state = :state', { state: OrderState.DONE })
      .andWhere('order.deleteAt IS NULL')

    const totalSoldByBookId = this.bookRepo
      .createQueryBuilder('book')
      .select('book.id', 'id')
      .addSelect('book.name', 'name')
      .addSelect('SUM(bookSold.quantity)', 'totalSold')
      .leftJoin(`(${orderDetailSold.getQuery()})`, 'bookSold', 'book.id = bookSold.bookId')
      .setParameters(orderDetailSold.getParameters())
      .groupBy('book.id')
      .addGroupBy('book.name')

    return await totalSoldByBookId.getRawMany()
  }

  public async statisticsSoldCategory(fromDate: Date, toDate: Date) {
    const orderDetailSold = this.orderDetailRepo
      .createQueryBuilder('orderdetail')
      .select('orderdetail.bookId', 'bookId')
      .addSelect('orderdetail.quantity', 'quantity')
      .innerJoin('orderdetail.order', 'order')
      .where('order.createdAt >= :fromDate', { fromDate: fromDate })
      .andWhere('order.createdAt <= :toDate', { toDate: toDate })
      .andWhere('order.state = :state', { state: OrderState.DONE })
      .andWhere('order.deleteAt IS NULL')

    const totalSoldByCategory = this.categoryRepo
      .createQueryBuilder('category')
      .select('category.id', 'id')
      .addSelect('category.name', 'name')
      .addSelect('SUM(bookSold.quantity)', 'totalSold')
      .leftJoin('book_category_category_book', 'book_category', 'category.id = book_category.categoryId')
      .leftJoin('book', 'book', 'book.id = book_category.bookId')
      .leftJoin(`(${orderDetailSold.getQuery()})`, 'bookSold', 'book.id = bookSold.bookId')
      .setParameters(orderDetailSold.getParameters())
      .andWhere('book.deleteAt IS NULL')
      .groupBy('category.id')
      .addGroupBy('category.name')

    return await totalSoldByCategory.getRawMany()
  }

  private async statisticsOrderDoneByMonth(fromDate: Date, toDate: Date) {
    const orderDone = this.orderRepo
      .createQueryBuilder('order')
      .select('order.id', 'id')
      .addSelect('order.totalOrder', 'totalOrder')
      .addSelect('MONTH(order.createdAt)', 'month')
      .andWhere('order.state = :state', { state: OrderState.DONE })
      .andWhere('order.createdAt >= :fromDate', { fromDate: fromDate })
      .andWhere('order.createdAt <= :toDate', { toDate: toDate })

    const totalOrderByMonth = this.connection
      .createQueryBuilder()
      .select('months.month')
      .addSelect('COUNT(orderDone.id)', 'totalOrder')
      .addSelect('SUM(orderDone.totalOrder)', 'totalMoney')
      .from(
        `(${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((val) => `SELECT ${val} AS month`).join(' UNION ')})`,
        'months',
      )
      .leftJoin(`(${orderDone.getQuery()})`, 'orderDone', 'orderDone.month = months.month')
      .setParameters(orderDone.getParameters())
      .groupBy('months.month')

    return await totalOrderByMonth.getRawMany()
  }

  private async statisticsOrderDoneByYear(fromDate: Date, toDate: Date) {
    const orderDone = this.orderRepo
      .createQueryBuilder('order')
      .select('YEAR(order.createdAt)', 'year')
      .addSelect('SUM(order.totalOrder)', 'totalOrder')
      .andWhere('order.state = :state', { state: OrderState.DONE })
      .andWhere('order.createdAt >= :fromDate', { fromDate: fromDate })
      .andWhere('order.createdAt <= :toDate', { toDate: toDate })
      .groupBy('YEAR(order.createdAt)')
      .orderBy('year', 'ASC')

    return await orderDone.getRawMany()
  }

  private async statisticsUserRegisteredByMonth(fromDate: Date, toDate: Date) {
    const userRegistered = this.connection
      .createQueryBuilder()
      .select('account.id', 'id')
      .addSelect('MONTH(account.createdAt)', 'month')
      .from('account', 'account')
      .andWhere('account.type = :type', { type: UserTypeEnum.USER })
      .andWhere('account.state = :state', { state: AccountState.VERIFIED })
      .andWhere('account.createdAt >= :fromDate', { fromDate: fromDate })
      .andWhere('account.createdAt <= :toDate', { toDate: toDate })
      .andWhere('account.deleteAt IS NULL')

    const totalUserRegisteredByMonth = this.connection
      .createQueryBuilder()
      .select('months.month')
      .addSelect('COUNT(userRegistered.id)', 'totalRegistered')
      .from(
        `(${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((val) => `SELECT ${val} AS month`).join(' UNION ')})`,
        'months',
      )
      .leftJoin(`(${userRegistered.getQuery()})`, 'userRegistered', 'userRegistered.month = months.month')
      .setParameters(userRegistered.getParameters())
      .groupBy('months.month')

    return await totalUserRegisteredByMonth.getRawMany()
  }

  private async statisticsCommentedByMonth(fromDate: Date, toDate: Date) {
    const commented = this.connection
      .createQueryBuilder()
      .select('comment.id', 'id')
      .addSelect('MONTH(comment.createdAt)', 'month')
      .from('comment', 'comment')
      .andWhere('comment.createdAt >= :fromDate', { fromDate: fromDate })
      .andWhere('comment.createdAt <= :toDate', { toDate: toDate })
      .andWhere('comment.deleteAt IS NULL')

    const totalCommentedByMonth = this.connection
      .createQueryBuilder()
      .select('months.month')
      .addSelect('COUNT(commented.id)', 'totalCommented')
      .from(
        `(${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((val) => `SELECT ${val} AS month`).join(' UNION ')})`,
        'months',
      )
      .leftJoin(`(${commented.getQuery()})`, 'commented', 'commented.month = months.month')
      .setParameters(commented.getParameters())
      .groupBy('months.month')

    return await totalCommentedByMonth.getRawMany()
  }

  private fromToYear(ofYear?: number) {
    const date = ofYear ? moment(`${ofYear}-01-01 00:00:00`, 'YYYY-MM-HH hh:mm') : moment()
    return {
      fromDate: date.startOf('year').toDate(),
      toDate: date.endOf('year').toDate(),
    }
  }

  private fromToMonth(ofMonth: number, ofYear: number) {
    const date = moment(`${ofYear}-${`00${ofMonth}`.slice(-2)}-01 00:00:00`, 'YYYY-MM-HH hh:mm')
    return {
      fromDate: date.startOf('month').toDate(),
      toDate: date.endOf('month').toDate(),
    }
  }

  public async statistics() {
    const year = new Date().getFullYear()
    const { fromDate, toDate } = this.fromToYear(year)

    const data = {
      orderDone: await this.statisticsOrderDoneByMonth(fromDate, toDate),
      userRegistered: await this.statisticsUserRegisteredByMonth(fromDate, toDate),
      comment: await this.statisticsCommentedByMonth(fromDate, toDate),
      bookSold: await Promise.all(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(async (item) => {
          const { fromDate: _fromDate, toDate: _toDate } = this.fromToMonth(item, year)

          const books = await this.statisticsSoldBook(_fromDate, _toDate)
          const total = books.reduce((prev, cur) => {
            return prev + (cur.totalSold ? +cur.totalSold : 0)
          }, 0)

          return {
            month: item,
            books: books,
            total: total,
            categories: await this.statisticsSoldCategory(_fromDate, _toDate),
          }
        }),
      ),
    }
    return data
  }

  public async statisticsRevenue(fromDate: Date, toDate: Date, timeType: StatisticsBy = StatisticsBy.MONTH) {
    if (timeType === StatisticsBy.MONTH) {
      const fromYear = fromDate.getFullYear()
      const toYear = toDate.getFullYear()

      const result = {}

      for (let year = fromYear; year <= toYear; year++) {
        const { fromDate: _fromDate, toDate: _toDate } = this.fromToYear(year)
        result[year] = await this.statisticsOrderDoneByMonth(_fromDate, _toDate)
      }

      return result
    } else if (timeType === StatisticsBy.YEAR) {
      return await this.statisticsOrderDoneByYear(fromDate, toDate)
    }
  }

  public toOrderInfos(categories: Order[]) {
    return categories.map((item) => {
      return this.toOrderInfo(item)
    })
  }

  public toOrderInfo(order: Order) {
    const { createdAt, updatedAt, deleteAt, verifyCode, verifyCodeExp, ...orderInfo } = order
    return orderInfo
  }
}
