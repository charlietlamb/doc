import client from '@doc/design-system/lib/client'
import type { RecurrenceForm } from '@doc/database/schema/recurrence-rules'

export async function createRecurrence(data: RecurrenceForm) {
  console.log('=== Creating recurrence ===')
  console.log(data)
  const response = await client.doctors[':doctorId']['recurring-slots'].$post({
    param: { doctorId: data.doctorId },
    json: {
      doctorId: data.doctorId,
      startTime: new Date(data.startTime).getTime(),
      endTime: new Date(data.endTime).getTime(),
      endDate: data.endDate ? new Date(data.endDate).getTime() : undefined,
      weekdays: data.weekdays || 0,
      recurrenceType: data.recurrenceType,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to create slot')
  }

  return response.json()
}
