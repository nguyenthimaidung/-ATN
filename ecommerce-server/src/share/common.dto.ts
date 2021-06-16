import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { Transforms } from './basic.transform'

export class StringIdDto {
  @IsString()
  @ApiProperty()
  id: string
}

export class NumberIdDto {
  @IsNumber()
  @ApiProperty()
  @Transform(Transforms.integer)
  id: number
}

export class QueryPaginationDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(Transforms.integer)
  page?: number

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(Transforms.integer)
  take?: number
}
