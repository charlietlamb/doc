import { HttpStatusCodes } from '@doc/http'
import {
  CreateDoctorRoute,
  GetBookedSlotsRoute,
  GetAvailableSlotsRoute,
  GetDoctorsRoute,
  GetReccurenceRulesRoute,
} from '@doc/hono/routes/doc/doc.routes'
import { AppRouteHandler } from '@doc/hono/lib/types'
import { doctors } from '@doc/database/schema/doctors'
import { db } from '@doc/database/postgres'
import { eq, and, sql } from 'drizzle-orm'
import { slots } from '@doc/database/schema/slots'
import { recurrenceRules } from '@doc/database/schema/recurrence-rules'

export const create: AppRouteHandler<CreateDoctorRoute> = async (c) => {
  const doctor = await c.req.json()
  try {
    const [selectedDoctor] = await db.insert(doctors).values(doctor).returning()
    return c.json(selectedDoctor, HttpStatusCodes.OK)
  } catch (error) {
    console.error(error)
    return c.json(
      { error: 'Failed to create doctor' },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}

export const getDoctors: AppRouteHandler<GetDoctorsRoute> = async (c) => {
  try {
    const selectedDoctors = await db.select().from(doctors)
    return c.json(selectedDoctors, HttpStatusCodes.OK)
  } catch (error) {
    return c.json(
      { error: 'Failed to get doctors' },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}

export const getBookedSlots: AppRouteHandler<GetBookedSlotsRoute> = async (
  c
) => {
  const doctorId = c.req.param('doctorId')
  const dateStr = c.req.query('date')

  if (!dateStr) {
    return c.json(
      { error: 'Date is required' },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    )
  }

  try {
    const date = new Date(dateStr)
    const startOfDay = new Date(date.setHours(0, 0, 0, 0))
    const endOfDay = new Date(date.setHours(23, 59, 59, 999))

    const bookedSlots = await db
      .select()
      .from(slots)
      .where(
        and(
          eq(slots.doctorId, doctorId),
          eq(slots.status, 'booked'),
          sql`${slots.startTime} >= ${startOfDay} AND ${slots.startTime} <= ${endOfDay}`
        )
      )
    return c.json(bookedSlots, HttpStatusCodes.OK)
  } catch (error) {
    return c.json(
      { error: 'Failed to get booked slots' },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}

export const getAvailableSlots: AppRouteHandler<
  GetAvailableSlotsRoute
> = async (c) => {
  const doctorId = c.req.param('doctorId')
  const dateStr = c.req.query('date')

  if (!dateStr) {
    return c.json(
      { error: 'Date is required' },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    )
  }

  try {
    const date = new Date(dateStr)
    const startOfDay = new Date(date.setHours(0, 0, 0, 0))
    const endOfDay = new Date(date.setHours(23, 59, 59, 999))

    const availableSlots = await db
      .select()
      .from(slots)
      .where(
        and(
          eq(slots.doctorId, doctorId),
          eq(slots.status, 'available'),
          sql`${slots.startTime} >= ${startOfDay} AND ${slots.startTime} <= ${endOfDay}`
        )
      )

    return c.json(availableSlots, HttpStatusCodes.OK)
  } catch (error) {
    return c.json(
      { error: 'Failed to get available slots' },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}

export const getReccurenceRules: AppRouteHandler<
  GetReccurenceRulesRoute
> = async (c) => {
  const doctorId = c.req.param('doctorId')
  const dateInt = parseInt(c.req.query('date') || '0')
  const date = new Date(dateInt)
  try {
    const recurrenceRulesResponse = await db
      .select()
      .from(recurrenceRules)
      .where(
        and(
          eq(recurrenceRules.doctorId, doctorId),
          sql`${recurrenceRules.endDate} >= ${date}`
        )
      )
    return c.json(recurrenceRulesResponse, HttpStatusCodes.OK)
  } catch (error) {
    return c.json(
      { error: 'Failed to get reccurence rules' },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}
