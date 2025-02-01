import { z } from 'zod'

export const server = {
  DATABASE_URL: z.string().min(1).url(),
  LOG_LEVEL: z
    .enum(['debug', 'info', 'warn', 'error'])
    .optional()
    .default('debug'),
  NODE_ENV: z.enum(['development', 'production', 'test']),
} as const
