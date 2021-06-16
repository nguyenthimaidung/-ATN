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

import { CommentService } from './comment.service'
import { AuthToken, AuthTokenOrNot, Token } from '../auth/token.decorator'
import { IAccessToken, TokenTypeEnum } from '../auth/token.interface'
import { UserTypeEnum } from '../account/account.interfaces'
import { ResponseInterceptor } from '../share/response.interceptor'
import { CreateCommentDto, QueryCommentDto, ReplyCommentDto } from './comment.dto'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Comment')
@Controller('api')
@UsePipes(
  new ValidationPipe({ transform: true, validateCustomDecorators: true, whitelist: true, forbidNonWhitelisted: true }),
)
@UseInterceptors(ResponseInterceptor)
export class CommentController {
  public constructor(private readonly commentService: CommentService) {}

  @Get('comment')
  public async getComment(@Query() query: QueryCommentDto): Promise<any> {
    return this.commentService.getCommentBookId(query.bookId, query.page, query.take)
  }

  @Post('comment')
  @AuthTokenOrNot(TokenTypeEnum.CLIENT, [UserTypeEnum.USER, UserTypeEnum.ADMIN])
  public async createComment(@Token() token: IAccessToken, @Body() body: CreateCommentDto): Promise<any> {
    return this.commentService.create(token && token.id, body)
  }

  @Post('data/comment/reply')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async replyComment(@Token() token: IAccessToken, @Body() body: ReplyCommentDto): Promise<any> {
    return this.commentService.reply(token.id, body)
  }

  @Delete('data/comment/:id')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async deleteComment(@Param('id') id: number): Promise<any> {
    await this.commentService.delete(id)
  }
}
