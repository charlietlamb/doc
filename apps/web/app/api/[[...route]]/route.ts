import { handle } from 'hono/vercel'
import app from '@doc/hono'

export const runtime = 'nodejs'

export const GET = handle(app)
export const POST = handle(app)
