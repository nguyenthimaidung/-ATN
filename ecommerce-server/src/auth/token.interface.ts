import { UserTypeEnum } from '../account/account.interfaces'

export interface IAccessToken {
  readonly exp: number
  readonly iat: number
  readonly iss: number
  readonly id: string
  readonly email: string
  readonly type: TokenTypeEnum
  readonly utype: UserTypeEnum
}

export enum TokenTypeEnum {
  CLIENT,
  SYSTEM,
}
