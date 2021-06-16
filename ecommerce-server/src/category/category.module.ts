import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CategoryController } from './category.controller'
import { Category } from './category.entity'
import { CategoryService } from './category.service'
import { TokenModule } from '../auth/token.module'

@Module({
  controllers: [CategoryController],
  imports: [TokenModule, TypeOrmModule.forFeature([Category])],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
