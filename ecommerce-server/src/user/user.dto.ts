import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'
import { NumberIdDto } from '../share/common.dto'

export class UpdateUserProfileDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public readonly name?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public readonly phone?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public readonly address?: string
}

export class UpdateWishlistDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({ isArray: true, type: () => NumberIdDto })
  @Type(() => NumberIdDto)
  public readonly bookIds: NumberIdDto[]
}

export class CartDetailDto {
  @IsNumber()
  @ApiProperty()
  public bookId: number

  @IsNumber()
  @ApiProperty()
  public quantity: number
}

export class UpdateCartDto {
  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({ isArray: true, type: () => CartDetailDto })
  @Type(() => CartDetailDto)
  public details: CartDetailDto[]
}
