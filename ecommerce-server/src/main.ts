import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { GoogleOAuth2 } from './services/gmail.service'
import { ExceptionFilter } from './share/exception.filter'
import { Logger } from './share/logger.util'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: process.env.DISABLE_NESTJS_LOG ? false : true })
  app.enableCors()
  const options = new DocumentBuilder()
    .setTitle('API Explorer')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'Bearer', bearerFormat: 'JWT' }, 'bearer')
    .build()

  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api/v1', app, document, { customSiteTitle: 'API Explorer' })

  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalFilters(new ExceptionFilter())
  await app.listen(+process.env.PORT || 4000)
  GoogleOAuth2.init()
  Logger.log('Main', `Server is listening http://localhost:${+process.env.PORT || 4000}`)
}
bootstrap()
