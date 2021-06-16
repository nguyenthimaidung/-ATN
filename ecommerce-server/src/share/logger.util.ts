import path = require('path')
import util = require('util')
import DailyRotateFile = require('winston-daily-rotate-file')
import { createLogger, format, Logform, transports, Logger as WinstonLogger } from 'winston'

import colors = require('colors/safe')
colors.enable()

function addColor(text: any, color: (text: any) => string, opts: any) {
  if (opts.colors) {
    return color(text)
  }
  return text
}

const formatRegExp = /%[scdjifoO%]/g

function formatMessage(color, level, context, msg, params, timestamp, trace, opts) {
  opts = { colors: false, compact: true, depth: null, ...opts }
  if (process.env.COMPACT_ENV) opts.compact = false
  opts.breakLength = opts.compact ? Infinity : 80

  trace = Array.isArray(trace) ? trace : trace ? [trace] : undefined
  if (typeof msg !== 'string') {
    params = [msg, ...params]
    msg = ''
  }

  const msgs = msg !== '' ? [msg] : [] //addColor(msg, color, opts)
  if (params && Array.isArray(params) && params.length != 0) {
    // extract format tokens
    const tokens = msg && msg.match && msg.match(formatRegExp)

    // push default format tokens
    let idx = tokens?.length ?? 0
    while (idx++ < params.length) {
      msgs.push('%O')
    }
  }

  // format message
  // 12/29/20 10:42:00.123 AM  90909/I  [Context] message
  // 12/29/20 10:42:00.123 AM  90909/D  [Context] message
  msg = util.formatWithOptions({ ...opts, colors: false }, msgs.join(' '), ...params)
  const levelPid = addColor(`${process.pid}/${level.substr(0, 1).toUpperCase()}`, color, opts)
  timestamp = addColor(timestamp, colors.green, opts)
  context = context ? addColor(`[${context}] `, colors.yellow, opts) : ''
  trace = trace ? addColor(`\n${trace.map((line) => `-  ${line}`).join('\n')}`, colors.gray, opts) : ''

  return `${timestamp}  ${levelPid}  ${context}${msg}${trace}`
}

const formats = {
  timestamp: format.timestamp({ format: 'MM/DD/YY, hh:mm:ss.SSS A' }),
  splatFormat: format((info: Logform.TransformableInfo, opts?: any) => {
    const { level, context, msg, params, timestamp, trace } = info
    function getLevelColor(level) {
      switch (level) {
        case 'info':
          return colors['brightGreen']
        case 'error':
          return colors['brightRed']
        case 'warn':
          return colors['brightYellow']
        case 'debug':
          return colors['brightMagenta']
        case 'verbose':
          return colors['brightCyan']
        default:
          return colors['brightGreen']
      }
    }
    info.message = formatMessage(getLevelColor(level), level, context, msg, params, timestamp, trace, opts)
    return info
  }),
  form: format.printf(({ message }) => {
    return message
  }),
}

export enum LogLevels {
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  WARN = 'warn',
  INFO = 'info',
  ERROR = 'error',
}

interface LogFileOption {
  /**Name of log file. */
  filename: string
  /**Log level is logged: verbose > debug > warn > info > error (default: verbose) */
  level?: LogLevels
  /**Maximum number of logs to keep. If set to null, no logs will be removed. This can be a number of files or number of days. If using days, add 'd' as the suffix. (default: '60d') */
  maxFiles?: string
  /**Log text colors. Set to true when using text colors. (default: false) */
  color?: boolean
}

class LogTransport {
  private static defaultLog = LogTransport.createDefaultLog()
  private static logFiles = new Map<string, WinstonLogger>()

  constructor() {
    throw new Error('Constructor is not implemented')
  }

  static getFileTransport(opts: LogFileOption) {
    let logFile = opts ? LogTransport.logFiles.get(opts.filename) : undefined
    if (opts && !logFile) {
      // create log file if is not exists
      const color = opts.color === undefined ? false : opts.color
      logFile = createLogger().add(
        new DailyRotateFile({
          level: opts.level || 'verbose',
          dirname: path.join(__dirname, `../../private/log/${opts.filename}`),
          filename: `${opts.filename}-%DATE%.log`,
          datePattern: 'MM-DD-YY',
          maxFiles: opts.maxFiles === null ? opts.maxFiles : opts.maxFiles || '60d',
          format: format.combine(formats.timestamp, formats.splatFormat({ colors: color }), formats.form),
        }),
      )
      LogTransport.logFiles.set(opts.filename, logFile)
      // allow write log to default log transport
      LogTransport.getDefault().transports.forEach((transport) => logFile.add(transport))
    }
    return logFile
  }

  static getDefault() {
    return LogTransport.defaultLog
  }

  private static createDefaultLog() {
    const defaultLog = createLogger()
    defaultLog.add(
      new transports.Console({
        level: 'silly',
        format: format.combine(formats.timestamp, formats.splatFormat({ colors: true }), formats.form),
      }),
    )
    return defaultLog
  }
}

export class Logger {
  private context: string
  private winstonLogger: WinstonLogger

  constructor(context: string, opts?: LogFileOption) {
    this.context = context
    this.winstonLogger = LogTransport.getFileTransport(opts)
  }

  error(message?: any, trace?: any, ...params: any[]) {
    this.callFunction('error', arguments.length ? message : '', trace, ...params)
  }

  log(message?: any, ...params: any[]) {
    this.callFunction('verbose', arguments.length ? message : '', null, ...params)
  }

  info(message?: any, ...params: any[]) {
    this.callFunction('info', arguments.length ? message : '', null, ...params)
  }

  warn(message?: any, ...params: any[]) {
    this.callFunction('warn', arguments.length ? message : '', null, ...params)
  }

  debug(message?: any, ...params: any[]) {
    this.callFunction('debug', arguments.length ? message : '', null, ...params)
  }

  verbose(message?: any, ...params: any[]) {
    this.callFunction('verbose', arguments.length ? message : '', null, ...params)
  }

  static log(context: string = '', message?: any, ...params: any[]) {
    LogTransport.getDefault().log('verbose', '', {
      context: context,
      params: params,
      msg: arguments.length !== 1 ? message : '',
    })
  }

  static info(context: string = '', message?: any, ...params: any[]) {
    LogTransport.getDefault().log('info', '', {
      context: context,
      params: params,
      msg: arguments.length !== 1 ? message : '',
    })
  }

  static error(context: string = '', message?: any, trace?: any, ...params: any[]) {
    LogTransport.getDefault().log('error', '', {
      context: context,
      params: params,
      msg: arguments.length !== 1 ? message : '',
      trace: trace,
    })
  }

  static warn(context: string = '', message?: any, ...params: any[]) {
    LogTransport.getDefault().log('warn', '', {
      context: context,
      params: params,
      msg: arguments.length !== 1 ? message : '',
    })
  }

  static debug(context: string = '', message?: any, ...params: any[]) {
    LogTransport.getDefault().log('debug', '', {
      context: context,
      params: params,
      msg: arguments.length !== 1 ? message : '',
    })
  }

  static verbose(context: string = '', message?: any, ...params: any[]) {
    LogTransport.getDefault().log('verbose', '', {
      context: context,
      params: params,
      msg: arguments.length !== 1 ? message : '',
    })
  }

  private callFunction(name, message: any, trace?: any, ...params: any[]) {
    const instance = this.winstonLogger || LogTransport.getDefault()
    instance.log(name, '', { context: this.context, params: params, msg: message, trace: trace })
  }
}
