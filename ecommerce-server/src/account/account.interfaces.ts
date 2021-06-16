export interface IAuthUser {
  id: string
  email: string
  type: UserTypeEnum
  // roles: any[]
  // createdAt: Date
  // updatedAt: Date
}

export enum UserTypeEnum {
  USER = 0,
  ADMIN = 1,
}

export enum ResourceRoleEnum {
  READ = 0,
  CREATE = 1,
  DELETE = 2,
  UPDATE = 3,
  ALL = 4,
}

export enum AccountState {
  REGISTERED = 0,
  VERIFIED = 1,
}

export const UserRoleEnumAsArray = Object.keys(UserTypeEnum)
