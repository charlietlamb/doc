import client from '@doc/design-system/lib/client'
import type { GetBookedSlotsRoute } from '@doc/hono/routes/doc/doc.routes'

export async function getBookedSlots(doctorId: string, date: string) {
  const response = await client.doctors[':doctorId']['bookings'].$get({
    param: { doctorId },
    query: {
      startDate: date,
      endDate: date,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch booked slots')
  }

  return response.json()
}
