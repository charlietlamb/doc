import client from '@doc/design-system/lib/client'
import type { RecurrenceForm } from '@doc/database/schema/recurrence-rules'

export async function createRecurrence(data: RecurrenceForm) {
  const response = await client.doctors[':doctorId']['recurring-slots'].$post({
    param: { doctorId: data.doctorId },
    json: {
      ...data,
      startTime: new Date(data.startTime).getTime(),
      endTime: new Date(data.endTime).getTime(),
      endDate: data.endDate ? new Date(data.endDate).getTime() : undefined,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to create slot')
  }

  return response.json()
}
