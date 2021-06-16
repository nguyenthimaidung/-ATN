import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CommentController } from './comment.controller'
import { Comment } from './comment.entity'
import { CommentService } from './comment.service'
import { TokenModule } from '../auth/token.module'
import { Book } from '../book/book.entity'
import { BookRate } from './book-rate.entity'
import { AccountModule } from '../account/account.module'
import { BookModule } from '../book/book.module'

@Module({
  controllers: [CommentController],
  imports: [TokenModule, TypeOrmModule.forFeature([Comment, Book, BookRate]), AccountModule, BookModule],
  providers: [CommentService],
  exports: [CommentService],
})
export class CommentModule {}
