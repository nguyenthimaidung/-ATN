import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class UpdatePageDto {
  @IsString()
  @ApiProperty({ required: true })
  public path: string
  @IsString()
  @ApiProperty({ required: true })
  public content: string
}
