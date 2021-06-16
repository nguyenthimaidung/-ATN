import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { OrderController } from './order.controller'
import { Order } from './order.entity'
import { OrderService } from './order.service'
import { TokenModule } from '../auth/token.module'
import { UserModule } from '../user/user.module'
import { Book } from '../book/book.entity'
import { OrderDetail } from './order-detail.entity'
import { Category } from '../category/category.entity'

@Module({
  controllers: [OrderController],
  imports: [TokenModule, TypeOrmModule.forFeature([Order, Book, Category, OrderDetail]), UserModule],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
