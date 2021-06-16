import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import path = require('path')
import dotenv = require('dotenv')
import { ServeStaticModule } from '@nestjs/serve-static'

import { AccountModule } from './account/account.module'
import { UserModule } from './user/user.module'
import { FileModule } from './file/file.module'
import { AdminModule } from './admin/admin.module'
import { PUBLIC_FOLDER } from './file/file.service'
import { DatabseModule } from './database/database.module'
import { CategoryModule } from './category/category.module'
import { AuthorModule } from './author/author.module'
import { BookModule } from './book/book.module'
import { OrderModule } from './order/order.module'
import { CommentModule } from './comment/comment.module'
import { PageModule } from './page/page.module'

dotenv.config()

@Module({
  imports: [
    ServeStaticModule.forRoot({
      serveRoot: '/static',
      rootPath: PUBLIC_FOLDER,
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mongodb',
    //   database: 'ecommerce',
    //   entities: [path.join(__dirname, '**/*.entity{.ts,.js}')],
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    //   host: process.env.DB_HOST || 'localhost', //process.env.DB_HOST,
    //   port: +(process.env.DB_HOST || 27017),
    //   username: process.env.DB_ADMIN_USERNAME || undefined,
    //   password: process.env.DB_ADMIN_PASSWORD || undefined,
    // }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      database: 'ecommerce',
      entities: [path.join(__dirname, '**/*.entity{.ts,.js}')],
      host: process.env.DB_HOST || 'localhost', //process.env.DB_HOST,
      port: +(process.env.DB_HOST || 3306),
      username: process.env.DB_ADMIN_USERNAME || undefined,
      password: process.env.DB_ADMIN_PASSWORD || undefined,
      synchronize: true, //only use when delvelop
      autoLoadEntities: true,
      migrationsTransactionMode: 'all',
    }),
    AccountModule,
    UserModule,
    AdminModule,
    FileModule,
    DatabseModule,
    CategoryModule,
    AuthorModule,
    BookModule,
    OrderModule,
    CommentModule,
    PageModule,
  ],
})
export class AppModule {}
