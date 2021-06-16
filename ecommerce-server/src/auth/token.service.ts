import { Injectable } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'

import { TokenConstants } from './token.constants'
import { IAccessToken, TokenTypeEnum } from './token.interface'
import { IAuthUser } from '../account/account.interfaces'

@Injectable()
export class TokenService {
  public validateAccessToken(token: string): IAccessToken {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: TokenConstants.access_token.options.issuer,
    }) as IAccessToken
  }

  public createAccessTokenFromAuthUser(user: IAuthUser): string {
    const payload = {
      email: user.email,
      id: user.id,
      // role: user.role,
      utype: user.type,
      type: TokenTypeEnum.CLIENT,
    }
    return jwt.sign(payload, process.env.JWT_SECRET, TokenConstants.access_token.options)
  }
}
