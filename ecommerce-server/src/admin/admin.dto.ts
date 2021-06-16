import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsString } from 'class-validator'

export class UpdateAdminProfileDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public readonly name?: string

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  public readonly phone?: string
}
