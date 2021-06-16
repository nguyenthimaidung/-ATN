import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Account } from '../account/account.entity'
import { AccountModule } from '../account/account.module'
import { UserModule } from '../user/user.module'
import { DatabaseService } from './database.service'

@Module({
  imports: [AccountModule, UserModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabseModule {}
