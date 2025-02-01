import { createEnv } from '@t3-oss/env-nextjs'
import { server } from './server'
import { client } from './client'

export type EnvType = ReturnType<typeof createEnv<typeof server, typeof client>>

export const env = createEnv({
  server,
  client,
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,

    LOG_LEVEL: process.env.LOG_LEVEL,
    NODE_ENV:
      process.env.NODE_ENV === 'undefined'
        ? 'development'
        : process.env.NODE_ENV,

    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
    NEXT_PUBLIC_WEB: process.env.NEXT_PUBLIC_WEB,
    NEXT_PUBLIC_API: process.env.NEXT_PUBLIC_API,
  },
})
