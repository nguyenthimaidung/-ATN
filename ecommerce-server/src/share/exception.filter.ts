import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common'
import { Logger } from 'src/share/logger.util'

const logger = new Logger('ExceptionFilter')

@Catch()
export class ExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    let error: any
    const res = host.switchToHttp().getResponse()
    const { method, params } = extractInfo(host)

    if (exception instanceof HttpException) {
      error = handleHttpException(exception)
    } else {
      error = handleOtherException(method, params, exception)
    }

    // write log to console
    const trace = ['inputs: ' + (params ? JSON.stringify(params) : params), 'output: ' + JSON.stringify(error)]
    error.status === 500 && trace.push(`detail: ${exception.stack || exception}`)
    logger.error(method, trace)

    res.status(error.status).json(error)
  }
}

function extractInfo(host: ArgumentsHost) {
  // extracted the default added context argument in the last position
  const req = host.switchToHttp().getRequest()
  const { headers, params, query, body, ip, ips, token } = req

  return {
    method: `${req.method} ${req.url}`,
    params: { ip: ip || ips[0], token, params, query, body },
  }
}

function handleHttpException(exception: HttpException) {
  const exceptionResponse = exception.getResponse() as any
  const { message, errorCode } = exceptionResponse || {}
  return {
    status: exception.getStatus(),
    message: Array.isArray(message) ? message[0] : message ? message : exception.message,
    errorCode: errorCode || exception.getStatus().toString(),
  }
}

function handleOtherException(method: string, params: any, exception: Error) {
  // write detailed log
  return {
    error: 'Internal Server Error',
    message: 'Internal Server Error',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  }
}
