import { createRouter } from '@doc/hono/lib/create-app'
import * as handlers from '@doc/hono/routes/doc/doc.handlers'
import * as routes from '@doc/hono/routes/doc/doc.routes'

const router = createRouter()
  .openapi(routes.create, handlers.create)
export default router
