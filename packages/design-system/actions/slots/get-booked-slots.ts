import client from '@doc/design-system/lib/client'
import { Slot } from '@doc/database/schema'

export async function getBookedSlots(
  doctorId: string,
  date: string
): Promise<Slot[]> {
  const response = await client.doctors[':doctorId']['bookings'].$get({
    param: { doctorId },
    query: {
      date: date,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch booked slots')
  }

  const data = await response.json()

  return data.map((slot) => ({
    ...slot,
    createdAt: new Date(slot.createdAt),
    updatedAt: new Date(slot.updatedAt),
    startTime: new Date(slot.startTime),
    endTime: new Date(slot.endTime),
  }))
}
