import { env } from '@doc/env'
import { AppOpenAPI } from '@doc/hono/lib/types'
import { cors } from 'hono/cors'

export default function configureCors(app: AppOpenAPI) {
  app.use('*', async (c, next) => {
    const corsMiddlewareHandler = cors({
      origin: [env.NEXT_PUBLIC_DOMAIN],
      allowHeaders: [
        'Access-Control-Allow-Origin',
        'Content-Type',
        'Authorization',
        'Accept',
        'X-Requested-With',
      ],
      allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE', 'PATCH'],
      exposeHeaders: ['Content-Length', 'Content-Type'],
      maxAge: 600,
      credentials: true,
    })
    return corsMiddlewareHandler(c, next)
  })
}
