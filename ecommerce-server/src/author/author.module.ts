import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthorController } from './author.controller'
import { Author } from './author.entity'
import { AuthorService } from './author.service'
import { TokenModule } from '../auth/token.module'

@Module({
  controllers: [AuthorController],
  imports: [TokenModule, TypeOrmModule.forFeature([Author])],
  providers: [AuthorService],
  exports: [AuthorService],
})
export class AuthorModule {}
