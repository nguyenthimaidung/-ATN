import {
  Body,
  Controller,
  Get,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  Delete,
  Patch,
  Query,
} from '@nestjs/common'

import { PageService } from './page.service'
import { AuthToken } from '../auth/token.decorator'
import { TokenTypeEnum } from '../auth/token.interface'
import { UserTypeEnum } from '../account/account.interfaces'
import { ResponseInterceptor } from '../share/response.interceptor'
import { UpdatePageDto } from './page.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Page')
@Controller('api')
@UsePipes(
  new ValidationPipe({ transform: true, validateCustomDecorators: true, whitelist: true, forbidNonWhitelisted: true }),
)
@UseInterceptors(ResponseInterceptor)
export class PageController {
  public constructor(private readonly pageService: PageService) {}

  @Get('page')
  public async getPage(@Query('path') path: string): Promise<any> {
    return this.pageService.get(path)
  }

  @Patch('data/page')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async updatePage(@Body() body: UpdatePageDto): Promise<any> {
    return this.pageService.update(body)
  }

  @Delete('data/page')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async deletePage(@Query('path') path: string): Promise<any> {
    await this.pageService.delete(path)
  }
}
