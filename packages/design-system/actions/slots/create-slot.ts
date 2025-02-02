'use server'

import client from '@doc/design-system/lib/client'
import type { SlotForm } from '@doc/database/schema/slots'

export async function createSlot(data: SlotForm, booked: boolean = false) {
  const endTime = new Date(data.startTime)
  endTime.setMinutes(data.startTime.getMinutes() + data.duration)

  const response = await client.doctors[':doctorId'].slots.$post({
    param: { doctorId: data.doctorId },
    json: {
      doctorId: data.doctorId,
      startTime: data.startTime.getTime(),
      endTime: endTime.getTime(),
      recurrenceRuleId: data.recurrenceRuleId,
      status: booked ? 'booked' : 'available',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to create slot')
  }

  return response.json()
}
