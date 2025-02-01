import { createRoute, z } from '@hono/zod-openapi'
import { HttpStatusCodes } from '@doc/http'
import { doctorFormSchema } from '@doc/database/schema/doctors'

const tags = ['Doctors']

const successResponse = z.object({ success: z.boolean() })
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
          schema: successResponse,
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
