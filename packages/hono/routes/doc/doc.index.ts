import { createRouter } from '@doc/hono/lib/create-app'
import * as handlers from '@doc/hono/routes/doc/doc.handlers'
import * as routes from '@doc/hono/routes/doc/doc.routes'

const router = createRouter()
  .openapi(routes.create, handlers.create)
  .openapi(routes.getDoctors, handlers.getDoctors)
  .openapi(routes.getBookedSlots, handlers.getBookedSlots)
  .openapi(routes.getAvailableSlots, handlers.getAvailableSlots)
export default router
