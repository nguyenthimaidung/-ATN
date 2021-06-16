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

import { BookService } from './book.service'
import { AuthToken } from '../auth/token.decorator'
import { TokenTypeEnum } from '../auth/token.interface'
import { UserTypeEnum } from '../account/account.interfaces'
import { ResponseInterceptor } from '../share/response.interceptor'
import { AdminFindBookDto, CreateBookDto, FindBookDto, UpdateBookDto } from './book.dto'
import { ApiTags } from '@nestjs/swagger'
import { dataFeild } from '../share/common'

@ApiTags('Book')
@Controller('api')
@UsePipes(
  new ValidationPipe({ transform: true, validateCustomDecorators: true, whitelist: true, forbidNonWhitelisted: true }),
)
@UseInterceptors(ResponseInterceptor)
export class BookController {
  public constructor(private readonly bookService: BookService) {}

  @Post('search/book')
  public async searchBook(@Body() body: FindBookDto): Promise<any> {
    const result = await this.bookService.getAll(body, body.page, body.take)
    result[dataFeild] = this.bookService.toBookInfoInfos(result[dataFeild])
    return result
  }

  @Get('book/recommend')
  public async getRecommendBookById(@Query('id') id?: number, @Query('take') take?: number): Promise<any> {
    return this.bookService.getRandoms(id, take)
  }

  @Get('book/:id')
  public async getBookById(@Param('id') id: number): Promise<any> {
    return this.bookService.toBookInfoInfo(await this.bookService.get(id))
  }

  @Post('data/search/book')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async searchDataBook(@Body() query: AdminFindBookDto): Promise<any> {
    return this.bookService.adminGetAll(query, query.page, query.take)
  }

  @Get('data/books')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async getAllBook(): Promise<any> {
    return this.bookService.adminGets();
  }

  @Get('data/book/:id')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async getDataBookById(@Param('id') id: number): Promise<any> {
    return this.bookService.get(id)
  }

  @Put('data/book/:id')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async updateBook(@Param('id') id: number, @Body() body: UpdateBookDto): Promise<any> {
    return this.bookService.update(id, body)
  }

  @Post('data/book')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async updateProfileUser(@Body() body: CreateBookDto): Promise<any> {
    console.log(body)
    return this.bookService.create(body)
  }

  @Delete('data/book/:id')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async deleteBook(@Param('id') id: number): Promise<any> {
    await this.bookService.delete(id)
  }
}
