import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateCategoryDto {
  @IsString()
  @ApiProperty()
  public name: string

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  public parentId: number
}

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public name: string

  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  public parentId: number
}
