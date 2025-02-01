import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import app from '@doc/hono'

export const runtime = 'nodejs'

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
export const PATCH = handle(app)
export const HEAD = handle(app)
export const OPTIONS = handle(app)
