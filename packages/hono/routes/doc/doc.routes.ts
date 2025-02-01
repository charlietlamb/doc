import { createRoute, z } from '@hono/zod-openapi'
import { HttpStatusCodes } from '@doc/http'
import { jsonContent } from 'stoker/openapi/helpers'
import { unauthorizedSchema } from '@acaci/hono/lib/configure/configure-auth'

const tags = ['Courses']

export const create = createRoute({
  path: '/doctors',
  method: 'post',
  summary: 'Create a doctor',
  tags,
  request: {
    body: jsonContent(
      z.object({
        title: z.string().min(1, 'Title is required'),
      }),
      'Doctor form.'
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectDoctorSchema, 'Doctor created.'),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      z.object({
        error: z.string(),
      }),
      'Failed to create business.'
    ),
    ...unauthorizedSchema,
  },
})

export type CreateCourseRoute = typeof create
