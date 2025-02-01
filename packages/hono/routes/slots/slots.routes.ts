import { createRoute, z } from '@hono/zod-openapi'
import { HttpStatusCodes } from '@doc/http'
import { slotFormSchema } from '@doc/database/schema'

const tags = ['Slots']

const successResponse = z.object({ success: z.boolean() })
const errorResponse = z.object({ error: z.string() })

export const create = createRoute({
  path: '/doctors/:doctorId/slots',
  method: 'post',
  summary: 'Create a slot',
  tags,
  request: {
    body: {
      content: {
        'application/json': {
          schema: slotFormSchema,
        },
      },
      description: 'Slot form.',
      required: true,
    },
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        'application/json': {
          schema: successResponse,
        },
      },
      description: 'Slot created.',
    },
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: {
      content: {
        'application/json': {
          schema: errorResponse,
        },
      },
      description: 'Failed to create slot.',
    },
  },
})

export type CreateSlotRoute = typeof create
