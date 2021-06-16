import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  Put,
  Param,
  Delete,
} from '@nestjs/common'
import { QueryPaginationDto } from '../share/common.dto'

import { CategoryService } from './category.service'
import { AuthToken } from '../auth/token.decorator'
import { TokenTypeEnum } from '../auth/token.interface'
import { UserTypeEnum } from '../account/account.interfaces'
import { ResponseInterceptor } from '../share/response.interceptor'
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Category')
@Controller('api')
@UsePipes(
  new ValidationPipe({ transform: true, validateCustomDecorators: true, whitelist: true, forbidNonWhitelisted: true }),
)
@UseInterceptors(ResponseInterceptor)
export class CategoryController {
  public constructor(private readonly categoryService: CategoryService) {}

  @Get('categories')
  public async getCategories(): Promise<any> {
    return this.categoryService.getCategories()
  }

  @Get('data/category')
  // @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN, UserTypeEnum.USER])
  public async getCategory(): Promise<any> {
    return this.categoryService.getAll()
  }

  @Put('data/category/:id')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async updateCategory(@Param('id') id: number, @Body() body: UpdateCategoryDto): Promise<any> {
    return this.categoryService.update(id, body)
  }

  @Post('data/category')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async createCategory(@Body() body: CreateCategoryDto): Promise<any> {
    return this.categoryService.create(body)
  }

  @Delete('data/category/:id')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async deleteCategory(@Param('id') id: number): Promise<any> {
    await this.categoryService.delete(id)
  }
}
