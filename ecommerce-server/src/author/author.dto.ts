import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsDate, IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator'
import { Transforms } from '../share/basic.transform'
import { Gender } from '../share/common'
import { QueryPaginationDto } from '../share/common.dto'

export class CreateAuthorDto {
  @IsString()
  @ApiProperty()
  public name: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public avatar?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public address?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public shortDescription?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public description?: string

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  public birth?: Date

  @IsEnum(Gender)
  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(Transforms.integer)
  public gender?: Gender
}

export class UpdateAuthorDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public name?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public avatar?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public address?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public shortDescription?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public description?: string

  @IsDateString()
  @IsOptional()
  @ApiProperty({ required: false })
  public birth?: Date

  @IsEnum(Gender)
  @IsOptional()
  @ApiProperty({ required: false })
  @Transform(Transforms.integer)
  public gender?: Gender
}

export class FindAuthorDto extends QueryPaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public search?: string
}
