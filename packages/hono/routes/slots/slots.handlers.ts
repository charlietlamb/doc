import { HttpStatusCodes } from '@doc/http'
import {
  BookSlotRoute,
  CreateSlotRoute,
  CreateRecurringSlotsRoute,
  GetAvailableSlotsRoute,
} from '@doc/hono/routes/slots/slots.routes'
import { AppRouteHandler } from '@doc/hono/lib/types'
import { slots } from '@doc/database/schema/slots'
import { db } from '@doc/database/postgres'
import { eq, and, sql } from 'drizzle-orm'
import { recurrenceRules } from '@doc/database/schema/recurrence-rules'
import { addWeeks, setHours, setMinutes, addMinutes, isBefore } from 'date-fns'
import { type RecurrenceRule } from '@doc/database/schema/recurrence-rules'
import { hasWeekday, WeekdayNumber } from '../../lib/weekdays'

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
          (${slots.startTime} < ${endTime} AND ${slots.endTime} > ${startTime})
          OR
          (${slots.startTime} <= ${startTime} AND ${slots.endTime} >= ${endTime})
          OR
          (${slots.startTime} >= ${startTime} AND ${slots.endTime} <= ${endTime})
        )`
      )
    )

  return overlappingSlots.length > 0
}

export const create: AppRouteHandler<CreateSlotRoute> = async (c) => {
  const slot = await c.req.valid('json')
  const startTime = new Date(slot.startTime)
  const endTime = new Date(slot.endTime)

  try {
    // Check for overlapping slots
    const hasOverlap = await checkSlotOverlap(slot.doctorId, startTime, endTime)
    if (hasOverlap) {
      return c.json(
        { error: 'This time slot overlaps with existing slots' },
        HttpStatusCodes.CONFLICT
      )
    }

    await db.insert(slots).values({
      ...slot,
      startTime,
      endTime,
      status: 'available',
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
    // Create the recurrence rule
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

    const generatedSlots = generateSlots(rule)

    if (generatedSlots.length > 0) {
      await db.insert(slots).values(
        generatedSlots.map((slot) => ({
          ...slot,
          status: 'available' as const,
          recurrenceRuleId: rule.id,
        }))
      )
    }

    const response = {
      rule: {
        doctorId: rule.doctorId,
        startTime: rule.startTime.toISOString(),
        endTime: rule.endTime.toISOString(),
        recurrenceType: rule.recurrenceType,
        weekdays: rule.weekdays,
        endDate: rule.endDate?.toISOString() ?? undefined,
        id: rule.id,
        createdAt: rule.createdAt.toISOString(),
        updatedAt: rule.updatedAt.toISOString(),
      },
      slotsCreated: generatedSlots.length,
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

function generateSlots(rule: RecurrenceRule) {
  const generatedSlots = []
  const currentDate = new Date(rule.startTime)
  const endDate = rule.endDate || addWeeks(currentDate, 12) // Default to 12 weeks if no end date

  // Calculate slot duration in minutes
  const slotDuration =
    (rule.endTime.getTime() - rule.startTime.getTime()) / 1000 / 60

  // Extract hours and minutes from start and end times
  const startHours = rule.startTime.getHours()
  const startMinutes = rule.startTime.getMinutes()
  const endHours = rule.endTime.getHours()
  const endMinutes = rule.endTime.getMinutes()

  while (isBefore(currentDate, endDate)) {
    const dayOfWeek = currentDate.getDay() as WeekdayNumber

    // Check if we should create slots for this day
    const shouldCreateSlots =
      rule.recurrenceType === 'once' ||
      rule.recurrenceType === 'daily' ||
      (rule.recurrenceType === 'weekly' && hasWeekday(rule.weekdays, dayOfWeek))

    if (shouldCreateSlots) {
      // Create slots for the day's time range
      let slotStart = new Date(currentDate)
      setHours(slotStart, startHours)
      setMinutes(slotStart, startMinutes)

      const dayEnd = new Date(currentDate)
      setHours(dayEnd, endHours)
      setMinutes(dayEnd, endMinutes)

      // If end time is before start time, move end time to next day
      if (isBefore(dayEnd, slotStart)) {
        dayEnd.setDate(dayEnd.getDate() + 1)
      }

      while (isBefore(slotStart, dayEnd)) {
        const slotEnd = addMinutes(slotStart, slotDuration)

        generatedSlots.push({
          doctorId: rule.doctorId,
          startTime: new Date(slotStart),
          endTime: new Date(slotEnd),
        })

        slotStart = slotEnd
      }
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return generatedSlots
}

export const getAvailableSlots: AppRouteHandler<
  GetAvailableSlotsRoute
> = async (c) => {
  const doctorId = c.req.param('doctorId')
  const dateStr = c.req.query('date')

  if (!dateStr) {
    return c.json({ error: 'Date is required' }, HttpStatusCodes.BAD_REQUEST)
  }

  try {
    const date = new Date(dateStr)
    const startOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    )
    const endOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      23,
      59,
      59,
      999
    )

    const availableSlots = await db
      .select({
        doctorId: slots.doctorId,
        startTime: slots.startTime,
        endTime: slots.endTime,
      })
      .from(slots)
      .where(
        and(
          eq(slots.doctorId, doctorId),
          eq(slots.status, 'available'),
          sql`${slots.startTime} >= ${startOfDay} AND ${slots.startTime} <= ${endOfDay}`
        )
      )

    const formattedSlots = availableSlots.map((slot) => ({
      doctorId: slot.doctorId,
      startTime: slot.startTime.getTime(),
      endTime: slot.endTime.getTime(),
    }))

    return c.json(formattedSlots, HttpStatusCodes.OK)
  } catch (error) {
    return c.json(
      { error: 'Failed to get available slots' },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}
