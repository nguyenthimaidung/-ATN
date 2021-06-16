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

import { UserService } from './user.service'
import { Token, AuthToken, AuthTokenOrNot } from '../auth/token.decorator'
import { TokenTypeEnum, IAccessToken } from '../auth/token.interface'
import { UserTypeEnum } from '../account/account.interfaces'
import { ResponseInterceptor } from '../share/response.interceptor'
import { UpdateCartDto, UpdateUserProfileDto, UpdateWishlistDto } from './user.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('User')
@Controller('api')
@UsePipes(new ValidationPipe({ transform: true, validateCustomDecorators: true, whitelist: true }))
@UseInterceptors(ResponseInterceptor)
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Get('user/profile')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.USER])
  public async getProfile(@Token() token: IAccessToken): Promise<any> {
    return this.userService.getProfile(token.id)
  }

  @Put('user/profile')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.USER])
  public async updateProfileUser(@Token() token: IAccessToken, @Body() body: UpdateUserProfileDto): Promise<any> {
    return this.userService.updateProfile(token.id, body)
  }

  @Get('user/wishlist')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.USER])
  public async getWishList(@Token() token: IAccessToken): Promise<any> {
    return this.userService.getWishlist(token.id)
  }

  @Put('user/wishlist')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.USER])
  public async updateWishList(@Token() token: IAccessToken, @Body() body: UpdateWishlistDto): Promise<any> {
    return this.userService.updateWishlist(
      token.id,
      body.bookIds.map((item) => item.id),
    )
  }

  @Get('user/cart')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.USER])
  public async getCart(@Token() token: IAccessToken): Promise<any> {
    return this.userService.getCart(token.id)
  }

  @Put('user/cart')
  @AuthTokenOrNot(TokenTypeEnum.CLIENT, [UserTypeEnum.USER])
  public async updateCart(@Token() token: IAccessToken, @Body() body: UpdateCartDto): Promise<any> {
    return this.userService.updateCart(token && token.id, body.details)
  }

  @Get('data/user/profile')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async getProfileUser(@Query('id') id: string): Promise<any> {
    return this.userService.getProfile(id)
  }
}
