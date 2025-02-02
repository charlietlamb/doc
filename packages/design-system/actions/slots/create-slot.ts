import client from '@doc/design-system/lib/client'
import type { SlotForm } from '@doc/database/schema/slots'

export async function createSlot(data: SlotForm) {
  const baseDate = new Date(data.date)
  baseDate.setHours(0, 0, 0, 0)

  const hours = data.time.getHours()
  const minutes = data.time.getMinutes()

  const startTime = new Date(baseDate)
  startTime.setHours(hours)
  startTime.setMinutes(minutes)

  const endTime = new Date(startTime)
  endTime.setMinutes(startTime.getMinutes() + data.duration)

  const response = await client.doctors[':doctorId'].slots.$post({
    param: { doctorId: data.doctorId },
    json: {
      doctorId: data.doctorId,
      startTime: startTime.getTime(),
      endTime: endTime.getTime(),
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create slot')
  }

  return response.json()
}
