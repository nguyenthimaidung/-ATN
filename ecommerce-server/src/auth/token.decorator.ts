import { createParamDecorator, ExecutionContext, SetMetadata, UseGuards, applyDecorators } from '@nestjs/common'
import { UserTypeEnum } from '../account/account.interfaces'
import { TokenTypeEnum } from './token.interface'
import { TokenGuard, TokenGuardHaveOrNot } from './token.guard'
import { ApiBearerAuth } from '@nestjs/swagger'

export const TOKEN_META_KEY = 'TOKEN_META_KEY'

export const AuthToken = (requiredTokenType: TokenTypeEnum, requiredUserTypes: UserTypeEnum[]) => {
  return applyDecorators(
    SetMetadata(TOKEN_META_KEY, new TokenHelper(requiredTokenType, requiredUserTypes)),
    UseGuards(TokenGuard),
    ApiBearerAuth(),
  )
}

export const AuthTokenOrNot = (requiredTokenType: TokenTypeEnum, requiredUserTypes: UserTypeEnum[]) => {
  return applyDecorators(
    SetMetadata(TOKEN_META_KEY, new TokenHelper(requiredTokenType, requiredUserTypes)),
    UseGuards(TokenGuardHaveOrNot),
    ApiBearerAuth(),
  )
}

export class TokenHelper {
  private requiredTokenType: TokenTypeEnum
  private requiredUserTypes: UserTypeEnum[]
  private requireUserRoles: any[]

  constructor(requiredTokenType: TokenTypeEnum, requiredUserTypes: UserTypeEnum[], requireUserRoles?: any[]) {
    this.requiredTokenType = requiredTokenType
    this.requiredUserTypes = requiredUserTypes
    this.requireUserRoles = requireUserRoles
  }

  public tokenIsOfType(tokenType: TokenTypeEnum): boolean {
    return tokenType === this.requiredTokenType
  }

  public tokenHasAllUserRoles(userRoles: any[]): boolean {
    return (
      this.requireUserRoles.every((requiredRole) => userRoles.indexOf(requiredRole) > -1) ||
      this.requireUserRoles.length === 0
    )
  }

  public allowUserType(userRole: UserTypeEnum): boolean {
    return this.requiredUserTypes.length === 0 || this.requiredUserTypes.includes(userRole)
  }
}

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().token,
)
