import { Slot } from '@doc/database/schema'
import client from '@doc/design-system/lib/client'

export async function getAvailableSlots(
  doctorId: string,
  date: string
): Slot[] {
  const response = await client.doctors[':doctorId'].available_slots.$get({
    param: { doctorId },
    query: { date },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch available slots')
  }

  return response.json()
}
