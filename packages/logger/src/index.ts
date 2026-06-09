import type { Logger } from 'pino'
import pino from 'pino'

const LOG_FORMAT_VALUES = ['json', 'pretty'] as const
const LOG_LEVEL_VALUES = ['error', 'warn', 'info', 'debug', 'trace'] as const

type LogFormat = (typeof LOG_FORMAT_VALUES)[number]
type LogLevel = (typeof LOG_LEVEL_VALUES)[number]

export interface AppLoggerOptions {
  app: string
  format?: string
  level?: string
}

type MessageFirstLogFn = {
  (message: string, meta?: Record<string, unknown>, ...args: unknown[]): void
} & Logger['info']

// Backward compatibility with the old logger
export type AppLogger = Omit<Logger, 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'> & {
  fatal: MessageFirstLogFn
  error: MessageFirstLogFn
  warn: MessageFirstLogFn
  info: MessageFirstLogFn
  debug: MessageFirstLogFn
  trace: MessageFirstLogFn
}

function assertLogFormat(value: string | undefined): LogFormat {
  const resolved = value ?? 'json'
  if ((LOG_FORMAT_VALUES as readonly string[]).includes(resolved)) {
    return resolved as LogFormat
  }

  throw new Error(`[logger] LOG_FORMAT="${value}" is invalid. Allowed values: json, pretty`)
}

function assertLogLevel(value: string): LogLevel {
  if ((LOG_LEVEL_VALUES as readonly string[]).includes(value)) {
    return value as LogLevel
  }

  throw new Error(`[logger] LOG_LEVEL="${value}" is invalid. Allowed values: ${LOG_LEVEL_VALUES.join(', ')}`)
}

export function createAppLogger(options: AppLoggerOptions): AppLogger {
  const format = assertLogFormat(options.format)
  const level = assertLogLevel(options.level ?? 'info')

  const logger = pino({
    name: options.app,
    level,
    messageKey: 'message',
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: label => ({ level: label }),
    },
    serializers: {
      err: pino.stdSerializers.err,
      error: pino.stdSerializers.err,
    },
    hooks: {
      logMethod(args, method) {
        // Backward compatibility with the old logger
        if (typeof args[0] === 'string' && typeof args[1] === 'object' && args[1] !== null) {
          method.apply(this, [args[1], args[0], ...args.slice(2)])
          return
        }

        method.apply(this, args)
      },
    },
    transport: format === 'pretty'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            messageKey: 'message',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  })

  return logger as AppLogger
}
