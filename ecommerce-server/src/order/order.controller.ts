import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  Put,
  Param,
  Delete,
  Ip,
  HttpStatus,
  HttpException,
  Response,
  NotFoundException,
  Headers,
  BadRequestException,
} from '@nestjs/common'
import { Response as ExpressResponse } from 'express'
import { QueryPaginationDto } from '../share/common.dto'

import { OrderService } from './order.service'
import { AuthToken, AuthTokenOrNot, Token } from '../auth/token.decorator'
import { IAccessToken, TokenTypeEnum } from '../auth/token.interface'
import { UserTypeEnum } from '../account/account.interfaces'
import { ResponseInterceptor } from '../share/response.interceptor'
import {
  CreateOrderDto,
  DropOrderDto,
  FindOrderDto,
  QueryDateFromToDto,
  QueryStatisticsRevenueDto,
  UpdateOrderDto,
  VerifyOrderDto,
} from './order.dto'
import { ApiTags } from '@nestjs/swagger'
import { OrderPayState, OrderPayType, OrderState } from './order.interface'
import { VNPay } from '../services/vnpay.service'
import { Errors } from '../share/error.code'

@ApiTags('Order')
@Controller('api')
@UsePipes(
  new ValidationPipe({ transform: true, validateCustomDecorators: true, whitelist: true, forbidNonWhitelisted: true }),
)
@UseInterceptors(ResponseInterceptor)
export class OrderController {
  public constructor(private readonly orderService: OrderService) {}

  @Get('order')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.USER])
  public async getOrderUser(@Token() token: IAccessToken, @Query() query: QueryPaginationDto): Promise<any> {
    return this.orderService.getAll({ userId: token.id }, query.page, query.take)
  }

  @Get('order/:id')
  public async getOrderUserById(@Param('id') id: number, @Query() query: DropOrderDto): Promise<any> {
    const order = await this.orderService.getOrder(id)
    if (order.userId || order.email !== query.email || order.phone !== query.phone) {
      throw new BadRequestException('Can not access order.')
    }
    return order
  }

  @Post('order')
  @AuthTokenOrNot(TokenTypeEnum.CLIENT, [UserTypeEnum.USER])
  public async updateOrderUser(@Token() token: IAccessToken, @Body() body: CreateOrderDto): Promise<any> {
    return this.orderService.draftOrder(token && token.id, body)
  }

  @Post('order/drop/:id')
  @AuthTokenOrNot(TokenTypeEnum.CLIENT, [UserTypeEnum.USER])
  public async dropOrderByUser(
    @Token() token: IAccessToken,
    @Param('id') id: number,
    @Body() body: DropOrderDto,
  ): Promise<any> {
    const order = await this.orderService.getOrder(id)
    if (token && token.id !== order.userId) {
      throw new BadRequestException('Can not access order.')
    }
    if (order.state === OrderState.DONE) {
      throw new BadRequestException('Can not drop after order finished.')
    }
    if (!token) {
      if (order.email !== body.email || order.phone !== body.phone) {
        throw new BadRequestException('Can not access order.')
      }
    }
    if (order.state !== OrderState.DROP && order.state >= OrderState.CREATE) {
      await this.orderService.restoreBookQuantity(order)
    }
    return this.orderService.update(id, {
      state: OrderState.DROP,
      payState: order.payState === OrderPayState.PAID ? OrderPayState.REFUND : order.payState,
    })
  }

  @Post('order/resendverifyorder/:id')
  public async verifyOrderUser(@Param('id') id: number): Promise<any> {
    return this.orderService.sendVerifyCodeOrder(id)
  }

  @Post('order/confirm')
  @AuthTokenOrNot(TokenTypeEnum.CLIENT, [UserTypeEnum.USER])
  public async userConfirm(
    @Ip() ip: string,
    @Token() token: IAccessToken,
    @Headers() headers,
    @Body() body: VerifyOrderDto,
  ): Promise<any> {
    const order = await this.orderService.create(token && token.id, body.orderId, body.verifyCode)
    const paymentUrl =
      order.payType === OrderPayType.ONLINE ? VNPay.createPaymentUrlOrder(ip, order, headers['origin']) : undefined
    return { order, paymentUrl }
  }

  @Get('payment/vnpay/check/url')
  public async vnpayPaymentCheckQueryReturnUrl(@Query() query: any): Promise<any> {
    const data = VNPay.verifyResponse(query)
    if (data) {
      // thanh toan thanh cong
      const order = await this.orderService.getOrder(data.orderId)
      if (!order) throw new NotFoundException(Errors.notExists('Order'))

      if (data.rspCode !== '00') {
        order.state !== OrderState.DROP && (await this.orderService.update(data.orderId, { state: OrderState.DROP }))
        return await this.orderService.getOrder(data.orderId)
      }

      if (order.payState === OrderPayState.NONE) {
        await this.orderService.update(data.orderId, { payState: OrderPayState.PAID })
        await this.orderService.decreaseBookQuantity(order)
      }
      return await this.orderService.getOrder(data.orderId)
    } else {
      throw new HttpException('Fail checksum', HttpStatus.NOT_ACCEPTABLE)
    }
  }

  @Get('payment/vnpay/ipn')
  public async vnpayPaymentIPN(@Response() res: ExpressResponse, @Query() query: any): Promise<any> {
    const data = VNPay.verifyResponse(query)
    if (data) {
      const order = await this.orderService.getOrder(data.orderId)
      if (!order) {
        res.status(200).json({ RspCode: '01', Message: 'Order not found' })
      } else {
        if (order.payState === OrderPayState.NONE) {
          if (data.rspCode === '00') {
            // thanh toan thanh cong
            await this.orderService.update(data.orderId, { payState: OrderPayState.PAID })
            await this.orderService.decreaseBookQuantity(order)
          } else {
            // thanh toan that bai
            await this.orderService.update(data.orderId, { state: OrderState.DROP })
          }
          res.status(200).json({ RspCode: '00', Message: 'Confirm success' })
        } else {
          res.status(200).json({ RspCode: '02', Message: 'Order already confirmed' })
        }
      }
    } else {
      res.status(200).json({ RspCode: '97', Message: 'Fail checksum' })
    }
  }

  @Get('data/order')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async getOrder(@Query() query: FindOrderDto): Promise<any> {
    return this.orderService.getAll(query, query.page, query.take)
  }

  @Put('data/order/:id')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async updateOrder(@Param('id') id: number, @Body() body: UpdateOrderDto): Promise<any> {
    if (body.state === OrderState.DROP) {
      const order = await this.orderService.getOrder(id)
      if (order.state !== OrderState.DROP && order.state >= OrderState.CREATE) {
        await this.orderService.restoreBookQuantity(order)
      }
    }
    return this.orderService.update(id, body)
  }

  @Delete('data/order/:id')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async deleteOrder(@Param('id') id: number): Promise<any> {
    await this.orderService.delete(id)
  }

  @Get('data/statistics')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async statistics(): Promise<any> {
    return await this.orderService.statistics()
  }

  @Get('data/statistics/revenue')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async statisticsRevenue(@Query() query: QueryStatisticsRevenueDto): Promise<any> {
    return await this.orderService.statisticsRevenue(new Date(query.fromDate), new Date(query.toDate), query.timeType)
  }

  @Get('data/statistics/sold/book')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async statisticsSoldBook(@Query() query: QueryDateFromToDto): Promise<any> {
    return await this.orderService.statisticsSoldBook(new Date(query.fromDate), new Date(query.toDate))
  }

  @Get('data/statistics/sold/category')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async statisticsSoldCategory(@Query() query: QueryDateFromToDto): Promise<any> {
    return await this.orderService.statisticsSoldCategory(new Date(query.fromDate), new Date(query.toDate))
  }
}
