import { ApiProperty } from '@nestjs/swagger'
import { Transform, Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Transforms } from '../share/basic.transform'
import { NumberIdDto, QueryPaginationDto } from '../share/common.dto'

export class CreateBookDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public thumbImg1?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public thumbImg2?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public thumbImg3?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public thumbImg4?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public thumbImg5?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public coverImage?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public isbn?: string

  @IsString()
  @ApiProperty()
  public name: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public shortDescription?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public description?: string

  @IsNumber()
  @ApiProperty()
  public quantity: number

  @IsNumber()
  @ApiProperty()
  public price: number

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  public discount?: number

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  public discountBegin?: Date

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  public discountEnd: Date

  @IsArray()
  @IsOptional()
  @ApiProperty({ required: false, isArray: true, type: () => NumberIdDto })
  @ValidateNested({ each: true })
  @Type(() => NumberIdDto)
  public categoryIds?: NumberIdDto[]

  @IsArray()
  @IsOptional()
  @ApiProperty({ required: false, isArray: true, type: () => NumberIdDto })
  @ValidateNested({ each: true })
  @Type(() => NumberIdDto)
  public authorIds?: NumberIdDto[]
}

export class UpdateBookDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public thumbImg1?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public thumbImg2?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public thumbImg3?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public thumbImg4?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public thumbImg5?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public coverImage?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public isbn?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public name?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public shortDescription?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public description?: string

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  public quantity?: number

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  public price?: number

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  public discount?: number

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  public discountBegin?: Date

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  public discountEnd: Date

  @IsArray()
  @IsOptional()
  @ApiProperty({ required: false, isArray: true, type: () => NumberIdDto })
  @ValidateNested({ each: true })
  @Type(() => NumberIdDto)
  public categoryIds?: NumberIdDto[]

  @IsArray()
  @IsOptional()
  @ApiProperty({ required: false, isArray: true, type: () => NumberIdDto })
  @ValidateNested({ each: true })
  @Type(() => NumberIdDto)
  public authorIds?: NumberIdDto[]
}

export enum SortBookBy {
  DEFAULT = 0,
  POPULAR = 1,
  BEST_RATE = 2,
  BEST_SELLERS = 3,
  PRICE_INCREASE = 4,
  PRICE_DECREASE = 5,
}

export class FindBookDto extends QueryPaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public name?: string

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(Transforms.integer)
  public minPrice?: number

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(Transforms.integer)
  public maxPrice?: number

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(Transforms.boolean)
  public isDiscounting?: boolean

  @IsArray()
  @IsOptional()
  @ApiProperty({ required: false, isArray: true, type: () => NumberIdDto })
  @ValidateNested({ each: true })
  @Type(() => NumberIdDto)
  public categoryIds?: NumberIdDto[]

  @IsArray()
  @IsOptional()
  @ApiProperty({ required: false, isArray: true, type: () => NumberIdDto })
  @ValidateNested({ each: true })
  @Type(() => NumberIdDto)
  public authorIds?: NumberIdDto[]

  @IsEnum(SortBookBy)
  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(Transforms.integer)
  public sortBy: number
}

export class AdminFindBookDto extends QueryPaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public search?: string

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(Transforms.integer)
  public minPrice?: number

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(Transforms.integer)
  public maxPrice?: number

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(Transforms.boolean)
  public isDiscounting?: boolean

  @IsArray()
  @IsOptional()
  @ApiProperty({ required: false, isArray: true, type: () => NumberIdDto })
  @ValidateNested({ each: true })
  @Type(() => NumberIdDto)
  public categoryIds?: NumberIdDto[]

  @IsArray()
  @IsOptional()
  @ApiProperty({ required: false, isArray: true, type: () => NumberIdDto })
  @ValidateNested({ each: true })
  @Type(() => NumberIdDto)
  public authorIds?: NumberIdDto[]

  @IsEnum(SortBookBy)
  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(Transforms.integer)
  public sortBy: number
}