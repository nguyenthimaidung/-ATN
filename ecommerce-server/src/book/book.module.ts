import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { BookController } from './book.controller'
import { Book } from './book.entity'
import { BookService } from './book.service'
import { TokenModule } from '../auth/token.module'
import { Category } from '../category/category.entity'
import { Author } from '../author/author.entity'

@Module({
  controllers: [BookController],
  imports: [TokenModule, TypeOrmModule.forFeature([Book, Category, Author])],
  providers: [BookService],
  exports: [BookService],
})
export class BookModule {}
