import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserController } from './user.controller'

import { User } from './user.entity'
import { UserService } from './user.service'
import { TokenModule } from '../auth/token.module'
import { Book } from '../book/book.entity'
import { CartDetail } from './cart-detail.entity'

@Module({
  controllers: [UserController],
  imports: [TokenModule, TypeOrmModule.forFeature([User, Book, CartDetail])],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
