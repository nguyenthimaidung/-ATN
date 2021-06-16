import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Param,
  Query,
  BadRequestException,
  ForbiddenException,
  GoneException,
} from '@nestjs/common'
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express'
import { ApiConsumes, ApiTags } from '@nestjs/swagger'
import { Express } from 'express'

import { FileService } from './file.service'
import { ApiFile, ApiMultiFile } from './file.decorator'
import { AuthToken, Token } from '../auth/token.decorator'
import { TokenTypeEnum, IAccessToken } from '../auth/token.interface'
import { UserTypeEnum } from '../account/account.interfaces'
import { GoogleOAuth2 } from '../services/gmail.service'
import { ResponseInterceptor } from '../share/response.interceptor'

@ApiTags('File')
@Controller('api')
@UseInterceptors(ResponseInterceptor)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiFile('file')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.USER, UserTypeEnum.ADMIN])
  public async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Token() token: IAccessToken) {
    return this.fileService.uploadAvatar(file, token.id, token.utype)
  }

  @Post('upload/file')
  @UseInterceptors(FilesInterceptor('files'))
  @ApiConsumes('multipart/form-data')
  @ApiMultiFile('files')
  @AuthToken(TokenTypeEnum.CLIENT, [UserTypeEnum.ADMIN])
  public async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return this.fileService.uploadFiles(files)
  }

  @Get('/system/googleauth/:client_secret')
  async googleauthCallback(@Param('client_secret') clientSecret: string, @Query('code') code: string) {
    if (!clientSecret || !code) throw new BadRequestException()
    const cedentials = GoogleOAuth2.getGoogleCedentials()
    if (cedentials?.web.client_secret !== clientSecret) throw new ForbiddenException()
    const result = await GoogleOAuth2.getToken(code)
    if (!result) throw new GoneException()
  }
}
