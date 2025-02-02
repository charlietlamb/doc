import { createRoute, z } from '@hono/zod-openapi'
import { HttpStatusCodes } from '@doc/http'
import {
  doctorFormSchema,
  selectDoctorSchema,
} from '@doc/database/schema/doctors'
import { selectSlotSchema } from '@doc/database/schema/slots'

const tags = ['Doctors']

const errorResponse = z.object({ error: z.string() })

export const create = createRoute({
  path: '/doctors',
  method: 'post',
  summary: 'Create a doctor',
  tags,
  request: {
    body: {
      content: {
        'application/json': {
          schema: doctorFormSchema,
        },
      },
      description: 'Doctor form.',
      required: true,
    },
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        'application/json': {
          schema: selectDoctorSchema,
        },
      },
      description: 'Doctor created.',
    },
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: {
      content: {
        'application/json': {
          schema: errorResponse,
        },
      },
      description: 'Failed to create doctor.',
    },
  },
})

export type CreateDoctorRoute = typeof create

export const getDoctors = createRoute({
  path: '/doctors',
  method: 'get',
  summary: 'Get doctors',
  tags,
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        'application/json': {
          schema: z.array(selectDoctorSchema),
        },
      },
      description: 'Doctors.',
    },
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: {
      content: {
        'application/json': {
          schema: errorResponse,
        },
      },
      description: 'Failed to get doctors.',
    },
  },
})

export type GetDoctorsRoute = typeof getDoctors

export const getBookedSlots = createRoute({
  path: '/doctors/:doctorId/bookings',
  method: 'get',
  summary: 'Get booked slots',
  tags,
  request: {
    query: z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        'application/json': {
          schema: z.array(selectSlotSchema),
        },
      },
      description: 'Booked slots.',
    },
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: {
      content: {
        'application/json': {
          schema: errorResponse,
        },
      },
      description: 'Failed to get booked slots.',
    },
  },
})

export type GetBookedSlotsRoute = typeof getBookedSlots

export const getAvailableSlots = createRoute({
  path: '/doctors/:doctorId/available_slots',
  method: 'get',
  summary: 'Get available slots',
  tags,
  request: {
    query: z.object({
      date: z.string(),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        'application/json': {
          schema: z.array(selectSlotSchema),
        },
      },
      description: 'Available slots.',
    },
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: {
      content: {
        'application/json': {
          schema: errorResponse,
        },
      },
      description: 'Failed to get available slots.',
    },
  },
})

export type GetAvailableSlotsRoute = typeof getAvailableSlots
