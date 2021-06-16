import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  Put,
} from '@nestjs/common'
import { QueryPaginationDto } from '../share/common.dto'

import { AdminService } from './admin.service'
import { Token, AuthToken } from '../auth/token.decorator'
import { TokenTypeEnum, IAccessToken } from '../auth/token.interface'
import { UserTypeEnum } from '../account/account.interfaces'
import { ResponseInterceptor } from '../share/response.interceptor'
import { UpdateAdminProfileDto } from './admin.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Admin')
@Controller('api')
@UsePipes(
  new ValidationPipe({ transform: true, validateCustomDecorators: true, whitelist: true, forbidNonWhitelisted: true }),
)
@UseInterceptors(ResponseInterceptor)
export class AdminController {
  public constructor(private readonly adminService: AdminService) {}

  @Get('admin/profile')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async getProfile(@Token() token: IAccessToken): Promise<any> {
    return this.adminService.getProfile(token.id)
  }

  @Put('admin/profile')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async updateProfileUser(@Token() token: IAccessToken, @Body() body: UpdateAdminProfileDto): Promise<any> {
    return this.adminService.updateProfile(token.id, body)
  }
}
