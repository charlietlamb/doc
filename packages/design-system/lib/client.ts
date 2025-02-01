import { hc } from 'hono/client'
import type { AppType } from '@doc/hono'
import { env } from '@doc/env'

const client = hc<AppType>(`${env.NEXT_PUBLIC_DOMAIN}/api`)

export default client
