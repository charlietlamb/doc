import { HttpStatusCodes } from '@doc/http'
import {
  BookSlotRoute,
  CreateSlotRoute,
  CreateRecurringSlotsRoute,
} from '@doc/hono/routes/slots/slots.routes'
import { AppRouteHandler } from '@doc/hono/lib/types'
import { slots } from '@doc/database/schema/slots'
import { db } from '@doc/database/postgres'
import { eq, and, sql } from 'drizzle-orm'
import { recurrenceRules } from '@doc/database/schema/recurrence-rules'

async function checkSlotOverlap(
  doctorId: string,
  startTime: Date,
  endTime: Date
): Promise<boolean> {
  const overlappingSlots = await db
    .select()
    .from(slots)
    .where(
      and(
        eq(slots.doctorId, doctorId),
        sql`(
          (${startTime} >= ${slots.startTime} AND ${startTime} < ${slots.endTime})
          OR
          (${endTime} > ${slots.startTime} AND ${endTime} <= ${slots.endTime})
        )`
      )
    )

  return overlappingSlots.length > 0
}

export const create: AppRouteHandler<CreateSlotRoute> = async (c) => {
  const slot = await c.req.valid('json')
  try {
    const hasOverlap = await checkSlotOverlap(
      slot.doctorId,
      new Date(slot.startTime),
      new Date(slot.endTime)
    )
    if (hasOverlap) {
      return c.json(
        { error: 'This time slot overlaps with existing slots' },
        HttpStatusCodes.CONFLICT
      )
    }

    await db.insert(slots).values({
      ...slot,
      startTime: new Date(slot.startTime),
      endTime: new Date(slot.endTime),
    })
    return c.json({ success: true }, HttpStatusCodes.OK)
  } catch (error) {
    console.error(error)
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

export const createRecurringSlots: AppRouteHandler<
  CreateRecurringSlotsRoute
> = async (c) => {
  const doctorId = c.req.param('doctorId')
  const data = await c.req.valid('json')

  try {
    const [rule] = await db
      .insert(recurrenceRules)
      .values({
        doctorId,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        recurrenceType: data.recurrenceType,
        weekdays: data.weekdays || 0,
        endDate: data.endDate ? new Date(data.endDate) : null,
      })
      .returning()

    const response = {
      doctorId: rule.doctorId,
      startTime: rule.startTime.toISOString(),
      endTime: rule.endTime.toISOString(),
      recurrenceType: rule.recurrenceType,
      weekdays: rule.weekdays,
      endDate: rule.endDate?.toISOString() ?? undefined,
      id: rule.id,
      createdAt: rule.createdAt.toISOString(),
      updatedAt: rule.updatedAt.toISOString(),
    } as const

    return c.json(response, HttpStatusCodes.OK)
  } catch (error) {
    console.error('Error creating recurring slots:', error)
    return c.json(
      { error: 'Failed to create recurring slots' },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}
