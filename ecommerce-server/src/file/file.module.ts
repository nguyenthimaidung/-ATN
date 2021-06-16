import { Module } from '@nestjs/common'

import { FileController } from './file.controller'
import { FileService, MAX_IMAGE_FILE_SIZE, imageFilter, PRIVATE_UPLOAD_FOLDER } from './file.service'
import { MulterModule } from '@nestjs/platform-express'
import { TokenModule } from '../auth/token.module'
import { AccountModule } from '../account/account.module'

@Module({
  controllers: [FileController],
  imports: [
    TokenModule,
    MulterModule.register({
      dest: PRIVATE_UPLOAD_FOLDER,
      fileFilter: imageFilter,
      limits: {
        fileSize: MAX_IMAGE_FILE_SIZE,
      },
    }),
    AccountModule,
  ],
  providers: [FileService],
})
export class FileModule {}
