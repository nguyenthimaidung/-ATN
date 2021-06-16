import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  Put,
  Param,
  Delete,
} from '@nestjs/common'

import { AuthorService } from './author.service'
import { AuthToken } from '../auth/token.decorator'
import { TokenTypeEnum } from '../auth/token.interface'
import { UserTypeEnum } from '../account/account.interfaces'
import { ResponseInterceptor } from '../share/response.interceptor'
import { CreateAuthorDto, FindAuthorDto } from './author.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Author')
@Controller('api')
@UsePipes(
  new ValidationPipe({ transform: true, validateCustomDecorators: true, whitelist: true, forbidNonWhitelisted: true }),
)
@UseInterceptors(ResponseInterceptor)
export class AuthorController {
  public constructor(private readonly authorService: AuthorService) {}

  @Get('author/some')
  public async getSomeAuthor(@Query('take') take?: number): Promise<any> {
    return this.authorService.getRandoms(take)
  }

  @Get('author/:id')
  public async getAuthorById(@Param('id') id: number): Promise<any> {
    return this.authorService.toAuthorInfoInfo(await this.authorService.get(id))
  }

  @Get('data/author')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async getAuthor(@Query() query: FindAuthorDto): Promise<any> {
    return this.authorService.getAll(query, query.page, query.take)
  }

  @Get('data/author/:id')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async getDataAuthorById(@Param('id') id: number): Promise<any> {
    return this.authorService.get(id)
  }

  @Put('data/author/:id')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async updateAuthor(@Param('id') id: number, @Body() body: CreateAuthorDto): Promise<any> {
    return this.authorService.update(id, body)
  }

  @Post('data/author')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async updateProfileUser(@Body() body: CreateAuthorDto): Promise<any> {
    return this.authorService.create(body)
  }

  @Delete('data/author/:id')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async deleteAuthor(@Param('id') id: number): Promise<any> {
    await this.authorService.delete(id)
  }
}
