import { Module } from '@nestjs/common'
import { TokenService } from './token.service'
import { TokenGuard } from './token.guard'

@Module({
  providers: [TokenService, TokenGuard],
  exports: [TokenService, TokenGuard],
})
export class TokenModule {}
