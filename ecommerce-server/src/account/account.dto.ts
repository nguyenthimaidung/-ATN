import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { Transforms } from '../share/basic.transform'
import { QueryPaginationDto } from '../share/common.dto'
import { AccountState, UserTypeEnum } from './account.interfaces'

export class CreateAccountDto {
  @IsString()
  @ApiProperty()
  public readonly email: string

  @IsString()
  @ApiProperty()
  public readonly password: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public readonly name: string
}

export class VerifyAccountDto {
  @IsString()
  @ApiProperty()
  public readonly email: string

  @IsString()
  @ApiProperty()
  public readonly password: string
}

export class ResendVerifyEmailCodeDto {
  @IsString()
  @ApiProperty()
  public readonly accountId: string
}

export class VerifyEmailDto {
  @IsString()
  @ApiProperty()
  public readonly accountId: string

  @IsString()
  @ApiProperty()
  public readonly verifyCode: string
}

export class FindAccountDto extends QueryPaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public readonly search: string

  @IsEnum(UserTypeEnum)
  @ApiProperty({ required: true })
  @Transform(Transforms.integer)
  public readonly type: UserTypeEnum

  @IsEnum(AccountState)
  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(Transforms.integer)
  public readonly state: AccountState
}
