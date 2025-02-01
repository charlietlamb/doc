import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const server = {
  DATABASE_URL: z.string().min(1).url(),
  LOG_LEVEL: z
    .enum(['debug', 'info', 'warn', 'error'])
    .optional()
    .default('debug'),
  NODE_ENV: z.enum(['development', 'production', 'test']),
} as const

const client = {
  NEXT_PUBLIC_DOMAIN: z.string().min(1).url(),
}

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
  },
})
