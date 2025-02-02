import { createRouter } from '@doc/hono/lib/create-app'
import * as handlers from '@doc/hono/routes/slots/slots.handlers'
import * as routes from '@doc/hono/routes/slots/slots.routes'

const router = createRouter()
  .openapi(routes.create, handlers.create)
  .openapi(routes.createRecurringSlots, handlers.createRecurringSlots)
  .openapi(routes.book, handlers.book)

export default router
