import { HttpStatusCodes } from '@doc/http'
import {
  BookSlotRoute,
  CreateSlotRoute,
} from '@doc/hono/routes/slots/slots.routes'
import { AppRouteHandler } from '@doc/hono/lib/types'
import { slots } from '@doc/database/schema/slots'
import { db } from '@doc/database/postgres'
import { eq } from 'drizzle-orm'

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

export const book: AppRouteHandler<BookSlotRoute> = async (c) => {
  const slotId = c.req.param('slotId')
  try {
    await db.update(slots).set({ status: 'booked' }).where(eq(slots.id, slotId))
    return c.json({ success: true }, HttpStatusCodes.OK)
  } catch (error) {
    return c.json(
      { error: 'Failed to book slot' },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}
