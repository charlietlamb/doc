import { MiddlewareHandler } from 'hono'
import { pinoLogger as logger } from 'hono-pino'
import pino from 'pino'
import pretty from 'pino-pretty'
import { env } from '@doc/env'

export function pinoLogger(): MiddlewareHandler {
  return async (c, next) => {
    const loggerMiddleware = logger({
      pino: pino(
        { level: env.LOG_LEVEL || 'info' },
        env.NODE_ENV === 'production' ? undefined : pretty()
      ),
      http: {
        reqId: () => {
          return crypto.randomUUID()
        },
      },
    })
    return loggerMiddleware(c, next)
  }
}
