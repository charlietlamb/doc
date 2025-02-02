import client from '@doc/design-system/lib/client'
import type { SlotForm } from '@doc/database/schema/slots'

export async function createSlot(data: SlotForm) {
  const response = await client.doctors[':doctorId'].slots.$post({
    param: { doctorId: data.doctorId },
    json: {
      ...data,
      startTime: new Date(data.startTime).getTime(),
      endTime: new Date(data.endTime).getTime(),
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create slot')
  }

  return response.json()
}
