import { HttpStatusCodes } from '@doc/http'
import { CreateSlotRoute } from '@doc/hono/routes/slots/slots.routes'
import { AppRouteHandler } from '@doc/hono/lib/types'
import { slots } from '@doc/database/schema/slots'
import { db } from '@doc/database/postgres'

export const create: AppRouteHandler<CreateSlotRoute> = async (c) => {
  const slot = await c.req.json()
  try {
    await db.insert(slots).values(slot)
    return c.json({ success: true }, HttpStatusCodes.OK)
  } catch (error) {
    return c.json(
      { error: 'Failed to create slot' },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}
