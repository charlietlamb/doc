import * as schema from '@doc/database/schema'
import { Pool } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-serverless'
import { type NeonDatabase } from 'drizzle-orm/neon-serverless'
import { env } from '@doc/env'

export type Database = NeonDatabase<typeof schema>

const pool = new Pool({ connectionString: env.DATABASE_URL })
export const db = drizzle(pool, { schema })
