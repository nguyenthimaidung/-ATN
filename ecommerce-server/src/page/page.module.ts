import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PageController } from './page.controller'
import { Page } from './page.entity'
import { PageService } from './page.service'
import { TokenModule } from '../auth/token.module'

@Module({
  controllers: [PageController],
  imports: [TokenModule, TypeOrmModule.forFeature([Page])],
  providers: [PageService],
  exports: [PageService],
})
export class PageModule {}
