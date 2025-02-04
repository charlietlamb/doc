import { HttpStatusCodes } from '@doc/http'
import {
  BookSlotRoute,
  CreateSlotRoute,
  CreateRecurringSlotsRoute,
} from '@doc/hono/routes/slots/slots.routes'
import { AppRouteHandler } from '@doc/hono/lib/types'
import { slots } from '@doc/database/schema/slots'
import { db } from '@doc/database/postgres'
import { eq, and, sql, gte, or, isNull } from 'drizzle-orm'
import { recurrenceRules } from '@doc/database/schema/recurrence-rules'

function isOverlapping(
  slot1Start: Date,
  slot1End: Date,
  slot2Start: Date,
  slot2End: Date
): boolean {
  return (
    (slot1Start >= slot2Start && slot1Start < slot2End) ||
    (slot1End > slot2Start && slot1End <= slot2End) ||
    (slot1Start <= slot2Start && slot1End >= slot2End)
  )
}

function getWeekday(date: Date): number {
  const day = date.getDay()
  return day === 0 ? 7 : day
}

function doesRecurrenceOverlap(
  slotStart: Date,
  slotEnd: Date,
  rule: {
    startTime: Date
    endTime: Date
    weekdays: number
    endDate: Date | null
  }
): boolean {
  if (rule.endDate && slotStart > rule.endDate) {
    return false
  }
  const slotWeekday = getWeekday(slotStart)
  const weekdayMatches = (rule.weekdays & (1 << (slotWeekday - 1))) !== 0
  if (!weekdayMatches) {
    return false
  }
  const ruleStartTime = new Date(slotStart)
  ruleStartTime.setHours(rule.startTime.getHours())
  ruleStartTime.setMinutes(rule.startTime.getMinutes())

  const ruleEndTime = new Date(slotStart)
  ruleEndTime.setHours(rule.endTime.getHours())
  ruleEndTime.setMinutes(rule.endTime.getMinutes())

  return isOverlapping(slotStart, slotEnd, ruleStartTime, ruleEndTime)
}

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
          OR
          (${startTime} <= ${slots.startTime} AND ${endTime} >= ${slots.endTime})
        )`
      )
    )

  if (overlappingSlots.length > 0) {
    return true
  }

  const recurrenceRulesList = await db
    .select()
    .from(recurrenceRules)
    .where(
      and(
        eq(recurrenceRules.doctorId, doctorId),
        or(
          isNull(recurrenceRules.endDate),
          gte(recurrenceRules.endDate, startTime)
        )
      )
    )

  for (const rule of recurrenceRulesList) {
    if (doesRecurrenceOverlap(startTime, endTime, rule)) {
      return true
    }
  }

  return false
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
    const startDate = new Date(data.startTime)
    const endDate = new Date(data.endTime)
    const hasOverlap = await checkSlotOverlap(doctorId, startDate, endDate)

    if (hasOverlap) {
      return c.json(
        {
          error:
            'This recurring slot overlaps with existing slots or other recurring slots',
        },
        HttpStatusCodes.CONFLICT
      )
    }

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

    return c.json(
      {
        doctorId: rule.doctorId,
        startTime: rule.startTime.toISOString(),
        endTime: rule.endTime.toISOString(),
        recurrenceType: rule.recurrenceType,
        weekdays: rule.weekdays,
        endDate: rule.endDate?.toISOString() ?? null,
        id: rule.id,
        createdAt: rule.createdAt.toISOString(),
        updatedAt: rule.updatedAt.toISOString(),
      },
      HttpStatusCodes.OK
    )
  } catch (error) {
    console.error('Error creating recurring slots:', error)
    return c.json(
      { error: 'Failed to create recurring slots' },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}
