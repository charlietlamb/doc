import { createRoute, z } from '@hono/zod-openapi'
import { HttpStatusCodes } from '@doc/http'
import { slotRouteSchema } from '@doc/database/schema'
import {
  insertRecurrenceRuleSchema,
  recurrenceRouteSchema,
} from '@doc/database/schema/recurrence-rules'
import { jsonContent } from 'stoker/openapi/helpers'

const tags = ['Slots']

const successResponse = z.object({ success: z.boolean() })
const errorResponse = z.object({ error: z.string() })

export const create = createRoute({
  method: 'post',
  path: '/doctors/:doctorId/slots',
  summary: 'Create a new slot',
  tags,
  request: {
    params: z.object({
      doctorId: z.string(),
    }),
    body: {
      content: {
        'application/json': {
          schema: slotRouteSchema,
        },
      },
    },
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
          }),
        },
      },
      description: 'Slot created successfully',
    },
    [HttpStatusCodes.CONFLICT]: {
      content: {
        'application/json': {
          schema: errorResponse,
        },
      },
      description: 'Slot overlaps with existing slots',
    },
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: {
      content: {
        'application/json': {
          schema: errorResponse,
        },
      },
      description: 'Failed to create slot',
    },
  },
})

export type CreateSlotRoute = typeof create

export const createRecurringSlots = createRoute({
  method: 'post',
  path: '/doctors/:doctorId/recurring-slots',
  summary: 'Create recurring slots for a doctor',
  tags: ['slots'],
  request: {
    params: z.object({
      doctorId: z.string(),
    }),
    body: jsonContent(recurrenceRouteSchema, 'Recurrence route schema'),
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        'application/json': {
          schema: insertRecurrenceRuleSchema,
        },
      },
      description: 'Recurring slots created successfully',
    },
    [HttpStatusCodes.CONFLICT]: {
      content: {
        'application/json': {
          schema: errorResponse,
        },
      },
      description: 'Slot overlaps with existing slots or recurrence rules',
    },
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: {
      content: {
        'application/json': {
          schema: errorResponse,
        },
      },
      description: 'Failed to create recurring slots',
    },
  },
})

export type CreateRecurringSlotsRoute = typeof createRecurringSlots

export const book = createRoute({
  path: '/slots/:slotId/book',
  method: 'post',
  summary: 'Book a slot',
  tags,
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        'application/json': {
          schema: successResponse,
        },
      },
      description: 'Slot booked.',
    },
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: {
      content: {
        'application/json': {
          schema: errorResponse,
        },
      },
      description: 'Failed to book slot.',
    },
  },
})

export type BookSlotRoute = typeof book

export const getAvailableSlots = createRoute({
  method: 'get',
  path: '/doctors/:doctorId/available-slots',
  summary: 'Get available slots for a doctor on a specific date',
  tags,
  request: {
    params: z.object({
      doctorId: z.string(),
    }),
    query: z.object({
      date: z.string().describe('Date in ISO format'),
    }),
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        'application/json': {
          schema: z.array(slotRouteSchema),
        },
      },
      description: 'Available slots retrieved successfully',
    },
    [HttpStatusCodes.BAD_REQUEST]: {
      content: {
        'application/json': {
          schema: errorResponse,
        },
      },
      description: 'Invalid date parameter',
    },
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: {
      content: {
        'application/json': {
          schema: errorResponse,
        },
      },
      description: 'Failed to retrieve available slots',
    },
  },
})

export type GetAvailableSlotsRoute = typeof getAvailableSlots
