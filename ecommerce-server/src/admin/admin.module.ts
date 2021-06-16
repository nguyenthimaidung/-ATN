import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminController } from './admin.controller'

import { Admin } from './admin.entity'
import { AdminService } from './admin.service'
import { TokenModule } from '../auth/token.module'

@Module({
  controllers: [AdminController],
  imports: [TokenModule, TypeOrmModule.forFeature([Admin])],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
