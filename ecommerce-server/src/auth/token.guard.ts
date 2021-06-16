import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { TokenService } from './token.service'
import { TokenHelper, TOKEN_META_KEY } from './token.decorator'

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly tokenService: TokenService) {}

  public async canActivate(context: ExecutionContext) {
    // check if the decorator is present
    const tokenRequirements = this.reflector.get<TokenHelper>(TOKEN_META_KEY, context.getHandler())
    if (!tokenRequirements) {
      return true
    } else {
      const req = context.switchToHttp().getRequest()
      if (req.headers.authorization && (req.headers.authorization as string).split(' ')[0] === 'Bearer') {
        try {
          // validate token
          const token = (req.headers.authorization as string).split(' ')[1]
          const decodedToken = await this.tokenService.validateAccessToken(token)

          // check if token is of the right type
          if (!tokenRequirements.tokenIsOfType(decodedToken.type)) return false

          if (!tokenRequirements.allowUserType(decodedToken.utype)) return false

          // save token in request object
          // console.log(decodedToken)
          req.token = decodedToken

          return true
        } catch (err) {
          return false
        }
      } else {
        return false
      }
    }
  }
}

@Injectable()
export class TokenGuardHaveOrNot implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly tokenService: TokenService) {}

  public async canActivate(context: ExecutionContext) {
    // check if the decorator is present
    const tokenRequirements = this.reflector.get<TokenHelper>(TOKEN_META_KEY, context.getHandler())
    if (!tokenRequirements) {
      return true
    } else {
      const req = context.switchToHttp().getRequest()
      if (req.headers.authorization && (req.headers.authorization as string).split(' ')[0] === 'Bearer') {
        try {
          // validate token
          const token = (req.headers.authorization as string).split(' ')[1]
          const decodedToken = await this.tokenService.validateAccessToken(token)

          // check if token is of the right type
          if (!tokenRequirements.tokenIsOfType(decodedToken.type)) return false

          if (!tokenRequirements.allowUserType(decodedToken.utype)) return false

          // save token in request object
          // console.log(decodedToken)
          req.token = decodedToken

          return true
        } catch (err) {
          return false
        }
      } else {
        return true
      }
    }
  }
}
