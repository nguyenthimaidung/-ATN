import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
import { Transforms } from '../share/basic.transform'
import { QueryPaginationDto } from '../share/common.dto'

export class CreateCommentDto {
  // any user can comment
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public name: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public phone: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public email: string

  @IsNumber()
  @Min(0)
  @Max(5)
  @IsOptional()
  @ApiProperty({ required: false })
  public rate: number

  @IsNumber()
  @ApiProperty()
  public bookId: number

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public content: string
}

export class ReplyCommentDto {
  @IsString()
  @ApiProperty()
  public content: string

  @IsNumber()
  @ApiProperty()
  public parentId: number
}

export class QueryCommentDto extends QueryPaginationDto {
  @IsNumber()
  @ApiProperty()
  @Transform(Transforms.integer)
  public bookId: number
}
