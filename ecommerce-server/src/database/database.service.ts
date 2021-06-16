import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Inject,
  HttpException,
  HttpStatus,
  NotAcceptableException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { UserService } from '../user/user.service'
import { Account } from '../account/account.entity'
import { AccountService } from '../account/account.service'
import { AccountState, UserTypeEnum } from '../account/account.interfaces'

@Injectable()
export class DatabaseService {
  constructor(@Inject(AccountService) private readonly accountService: AccountService) {
    this.initAdmin()
  }

  public async initAdmin() {
    await this.accountService
      .createAccount(
        {
          email: 'admin@ecommerce.com',
          password: '123456',
          name: 'Admin',
        },
        UserTypeEnum.ADMIN,
        AccountState.VERIFIED,
      )
      .catch(() => 0)
  }
}
