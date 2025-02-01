import client from '@doc/design-system/lib/client'
import type { SlotForm } from '@doc/database/schema/slots'

export async function createSlot(doctorId: string, data: SlotForm) {
  const response = await client.doctors[':doctorId'].slots.$post({
    param: { doctorId },
    json: data,
  })

  if (!response.ok) {
    throw new Error('Failed to create slot')
  }

  return response.json()
}
