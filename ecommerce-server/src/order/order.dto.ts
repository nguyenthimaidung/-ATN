import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { Transforms } from '../share/basic.transform'
import { QueryPaginationDto } from '../share/common.dto'
import { UpdateCartDto } from '../user/user.dto'
import { OrderPayState, OrderPayType, OrderState, StatisticsBy } from './order.interface'

export class CreateOrderDto extends UpdateCartDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  public id?: number

  @IsEnum(OrderPayType)
  @ApiProperty()
  public payType: OrderPayType

  @IsString()
  @ApiProperty()
  public name: string

  @IsString()
  @ApiProperty()
  public phone: string

  @IsString()
  @ApiProperty()
  public email: string

  @IsString()
  @ApiProperty()
  public address: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public note: string
}

export class UpdateOrderDto {
  @IsEnum(OrderState)
  @IsOptional()
  @ApiProperty({ required: false })
  public state?: OrderState

  @IsEnum(OrderPayType)
  @IsOptional()
  @ApiProperty({ required: false })
  public payType?: OrderPayType

  @IsEnum(OrderPayState)
  @IsOptional()
  @ApiProperty({ required: false })
  public payState?: OrderPayState

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public name?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public phone?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public email?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public address?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public note?: string
}

export class DropOrderDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public email?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public phone?: string
}

export class FindOrderDto extends QueryPaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public userId?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public search?: string

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  public fromDate?: Date

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  public toDate?: Date

  @IsEnum(OrderState)
  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(Transforms.integer)
  public state?: OrderState

  @IsEnum(OrderPayState)
  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(Transforms.integer)
  public payState?: OrderPayState

  @IsEnum(OrderPayType)
  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(Transforms.integer)
  public payType?: OrderPayType
}

export class VerifyOrderDto {
  @IsNumber()
  @ApiProperty()
  public readonly orderId: number

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public readonly verifyCode?: string
}

export class QueryDateFromToDto {
  @IsDateString()
  @ApiProperty({ required: true })
  fromDate: Date

  @IsDateString()
  @ApiProperty({ required: true })
  toDate: Date
}

export class QueryStatisticsRevenueDto extends QueryDateFromToDto {
  @IsEnum(StatisticsBy)
  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(Transforms.integer)
  timeType: StatisticsBy
}
