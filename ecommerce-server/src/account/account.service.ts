import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Inject,
  NotAcceptableException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as crypto from 'crypto'
import { Repository } from 'typeorm'

import { CreateAccountDto, FindAccountDto, VerifyAccountDto } from './account.dto'
import { Account } from './account.entity'
import { AccountState, UserTypeEnum } from './account.interfaces'
import { UserService } from '../user/user.service'
import { Errors } from '../share/error.code'
import { AdminService } from '../admin/admin.service'
import { GmailService } from '../services/gmail.service'
import { Logger } from '../share/logger.util'
import { dataFeild, paginationFeild } from '../share/common'

const TAG = 'AccountService'

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(AdminService) private readonly adminService: AdminService,
  ) {}

  public async getPublicAccount(id: string) {
    return this.accountRepo
      .findOneOrFail({ id })
      .catch(() => {
        throw new NotFoundException(Errors.notFound('Account'))
      })
      .then((user) => this.toPublicAccount(user))
  }

  public async getPublicInfo(id: string) {
    const userType = (id && +id.slice(0, 1)) | UserTypeEnum.USER
    switch (userType) {
      case UserTypeEnum.USER:
        return await this.userService.getPublicInfo(id)
      case UserTypeEnum.ADMIN:
        return await this.adminService.getPublicInfo(id)
      default:
        return await this.userService.getPublicInfo(id)
    }
  }

  public async createAccount(createAccountDto: CreateAccountDto, userType: UserTypeEnum, state?: AccountState) {
    const emailUser = await this.accountRepo.findOne({
      email: createAccountDto.email,
      type: userType,
    })
    if (emailUser) {
      if (emailUser.state === AccountState.REGISTERED) {
        // update name and password
        emailUser.password = createAccountDto.password
        if (state) emailUser.state = state
        await this.accountRepo.save(emailUser)

        const savedAccount = await this.accountRepo.findOne({ id: emailUser.id })
        await this.userService.updateProfile(savedAccount.id, { name: createAccountDto.name })

        await this.autoSendVerifyCode(savedAccount)

        return this.toPublicAccount(savedAccount)
      }
      throw new ConflictException(Errors.CONFLICT_EMAIL)
    }

    const account = Object.assign(new Account(), createAccountDto)
    account.type = userType
    if (state !== undefined) {
      account.state = state
    }
    const savedAccount = await this.accountRepo.save(account)

    switch (userType) {
      case UserTypeEnum.USER:
        await this.userService.create(createAccountDto, savedAccount)
        break
      case UserTypeEnum.ADMIN:
        await this.adminService.create(createAccountDto, savedAccount)
        break
    }

    await this.autoSendVerifyCode(savedAccount)

    return this.toPublicAccount(savedAccount)
  }

  public async updateAvatar(id, userType, avatar) {
    switch (userType) {
      case UserTypeEnum.USER:
        await await this.userService.updateProfile(id, { avatar })
        break
      case UserTypeEnum.ADMIN:
        await await this.adminService.updateProfile(id, { avatar })
        break
    }
  }

  public async getAccount(account: Account | string) {
    if (!(account instanceof Account)) {
      const id = account
      account = await await this.accountRepo.findOne({ id })
    }
    if (!account) {
      throw new NotFoundException(Errors.notExists('Account'))
    }
    return account
  }

  public async autoSendVerifyCode(account: Account) {
    if (
      account.state === AccountState.REGISTERED &&
      (!account.verifyCodeExp || account.verifyCodeExp.getTime() < Date.now())
    ) {
      await this.sendVerifyCodeAccount(account)
    }
  }

  public async sendVerifyCodeAccount(account: Account | string) {
    account = await this.getAccount(account)
    const verifyCode = await this.generateVerifyCodeAccount(account.id)

    GmailService.sendMail({
      from: `Book Ecommerce <${process.env.MAIL_ADDRESS}>`,
      to: account.email,
      subject: 'Book Ecommerce Verify Code',
      content: verifyCode.verifyCode,
    })

    Logger.info(TAG, 'sendVerifyCodeAccount', account.email, verifyCode)
  }

  public async generateVerifyCodeAccount(id) {
    const verifyInfo = {
      verifyCode: ('000000' + Math.floor(Math.random() * 999999)).slice(-6),
      verifyCodeExp: new Date(Date.now() + 3 * 60 * 1000),
    }

    await this.accountRepo.update(id, verifyInfo)

    return verifyInfo
  }

  public async acceptVerifyCode(account: Account | string, verifyCode: string) {
    account = await this.getAccount(account)
    if (account.verifyCode !== verifyCode) {
      throw new NotAcceptableException(Errors.VERIFY_CODE_INCORRECT)
    }
    if (!account.verifyCodeExp || account.verifyCodeExp.getTime() < Date.now()) {
      throw new NotAcceptableException(Errors.VERIFY_CODE_EXPIRED)
    }
    await this.accountRepo.update(account.id, {
      state: AccountState.VERIFIED,
      verifyCodeExp: 0,
    })
    return this.toPublicAccount(await this.getAccount(account.id))
  }

  public async verifyAuthUserByEmail(dto: VerifyAccountDto, userType: UserTypeEnum) {
    const acc = await this.accountRepo.findOne({ email: dto.email, type: userType })
    if (!acc) {
      throw new UnauthorizedException(Errors.EMAIL_OR_PASSWORD_INCORECT)
    }

    const passHash = crypto.createHmac('sha256', acc.passwordSalt).update(dto.password).digest('hex')
    if (acc.password === passHash) {
      await this.autoSendVerifyCode(acc)
      return this.toPublicAccount(acc)
    } else {
      throw new UnauthorizedException(Errors.EMAIL_OR_PASSWORD_INCORECT)
    }
  }

  private toPublicAccount(acc: Account) {
    const { createdAt, updatedAt, deleteAt, verifyCode, verifyCodeExp, password, passwordSalt, ...publicAccount } = acc
    return publicAccount
  }

  public async getAccounts(findInfo: FindAccountDto, page?: number, take?: number) {
    page = page || 0
    take = take || 20

    const result = {}
    if (findInfo.type === UserTypeEnum.ADMIN) {
      const [data, total] = await this.adminService.getAll(findInfo, page, take)

      result[paginationFeild] = { total, page, take }
      result[dataFeild] = data.map((item: any) => {
        item.account = this.toPublicAccount(item.account)
        return item
      })
      return result
    } else {
      const [data, total] = await this.userService.getAll(findInfo, page, take)

      result[paginationFeild] = { total, page, take }
      result[dataFeild] = data.map((item: any) => {
        item.account = this.toPublicAccount(item.account)
        return item
      })
      return result
    }
  }
}
