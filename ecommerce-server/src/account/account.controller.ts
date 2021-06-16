import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import {
  CreateAccountDto,
  VerifyAccountDto,
  VerifyEmailDto,
  ResendVerifyEmailCodeDto,
  FindAccountDto,
} from './account.dto'
import { UserTypeEnum, AccountState } from './account.interfaces'
import { AccountService } from './account.service'
import { TokenService } from '../auth/token.service'
import { AuthToken, Token } from '../auth/token.decorator'
import { IAccessToken, TokenTypeEnum } from '../auth/token.interface'
import { ResponseInterceptor } from '../share/response.interceptor'

@ApiTags('Account')
@Controller('api')
@UsePipes(new ValidationPipe({ transform: true, validateCustomDecorators: true, whitelist: true }))
@UseInterceptors(ResponseInterceptor)
export class AccountController {
  public constructor(private readonly accountService: AccountService, private readonly tokenService: TokenService) {}

  @Post('admin/signup')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async createAdmin(@Body() dto: CreateAccountDto): Promise<any> {
    return this.accountService.createAccount(dto, UserTypeEnum.ADMIN)
  }

  @Post('admin/signin')
  public async verifyAdminByEmail(@Body() dto: VerifyAccountDto): Promise<any> {
    const user = await this.accountService.verifyAuthUserByEmail(dto, UserTypeEnum.ADMIN)
    if (user.state === AccountState.REGISTERED) {
      return { user, isMustVerifyEmail: true }
    }
    return { user, token: this.tokenService.createAccessTokenFromAuthUser(user) }
  }

  @Post('user/signup')
  public async createUser(@Body() dto: CreateAccountDto): Promise<any> {
    return this.accountService.createAccount(dto, UserTypeEnum.USER)
  }

  @Post('user/signin')
  public async verifyUserByEmail(@Body() dto: VerifyAccountDto): Promise<any> {
    const user = await this.accountService.verifyAuthUserByEmail(dto, UserTypeEnum.USER)
    if (user.state === AccountState.REGISTERED) {
      return { user, isMustVerifyEmail: true }
    }
    return { user, token: this.tokenService.createAccessTokenFromAuthUser(user) }
  }

  @Get('account/info')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.USER, UserTypeEnum.ADMIN])
  public async getPublicAccount(@Token() token: IAccessToken): Promise<any> {
    return this.accountService.getPublicAccount(token.id)
  }

  @Get('account/profile')
  public async getProfile(@Query('id') id: string): Promise<any> {
    return this.accountService.getPublicInfo(id)
  }

  @Post('account/resendverifyemail')
  public async resendVerifyEmail(@Body() dto: ResendVerifyEmailCodeDto): Promise<any> {
    const account = await this.accountService.getAccount(dto.accountId)
    if (account.state === AccountState.VERIFIED) return
    await this.accountService.sendVerifyCodeAccount(account)
  }

  @Post('account/verifyemail')
  public async verifyEmail(@Body() dto: VerifyEmailDto): Promise<any> {
    const user = await this.accountService.acceptVerifyCode(dto.accountId, dto.verifyCode)
    return { user, token: this.tokenService.createAccessTokenFromAuthUser(user) }
  }

  @Get('data/account')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async getAccounts(@Query() query: FindAccountDto) {
    const { page, take, ...where } = query
    return await this.accountService.getAccounts(where, page, take)
  }
}
