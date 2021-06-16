import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from '../user/user.module'

import { AccountController } from './account.controller'
import { Account } from './account.entity'
import { AccountService } from './account.service'
import { TokenModule } from '../auth/token.module'
import { AdminModule } from '../admin/admin.module'

@Module({
  controllers: [AccountController],
  imports: [TokenModule, TypeOrmModule.forFeature([Account]), UserModule, AdminModule],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
