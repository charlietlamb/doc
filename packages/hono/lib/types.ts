import { OpenAPIHono, RouteConfig, RouteHandler, z } from '@hono/zod-openapi'
import { EnvType } from '@doc/env'
import { PinoLogger } from 'hono-pino'

export interface AppBindings {
  Bindings: EnvType
  Variables: {
    logger: PinoLogger
  }
}

export type AppOpenAPI = OpenAPIHono<AppBindings>

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>
