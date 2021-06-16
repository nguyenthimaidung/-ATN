import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { dataFeild, paginationFeild } from './common'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof HttpException) {
          throw data
        }
        context.switchToHttp().getResponse().status(200)
        return {
          status: 200,
          message: 'success',
          data: (data && data[dataFeild]) || data,
          pagination: data && data[paginationFeild],
        }
      }),
    )
  }
}
