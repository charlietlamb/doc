import { HttpStatusCodes } from '@doc/http'
import { CreateDoctorRoute } from '@doc/hono/routes/doc/doc.routes'
import { AppRouteHandler } from '@doc/hono/lib/types'
import { doctors } from '@doc/database/schema/doctors'
import { db } from '@doc/database/postgres'

export const create: AppRouteHandler<CreateDoctorRoute> = async (c) => {
  const doctor = await c.req.json()
  try {
    await db.insert(doctors).values(doctor)
    return c.json({ success: true }, HttpStatusCodes.OK)
  } catch (error) {
    return c.json(
      { error: 'Failed to create business' },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    )
  }
}
