import { AppOpenAPI } from '@doc/hono/lib/types'
import configureOpenAPI from '@doc/hono/lib/configure-open-api'
import configureCors from '@doc/hono/lib/configure-cors'

export default function configure(app: AppOpenAPI) {
  configureCors(app)
  configureOpenAPI(app)
}
