import { RecurrenceRule } from '@doc/database/schema/recurrence-rules'
import client from '@doc/design-system/lib/client'

export async function getReccurenceRules(
  doctorId: string,
  date: Date
): Promise<RecurrenceRule[]> {
  const response = await client.doctors[':doctorId'].recurrence_rules.$get({
    param: { doctorId },
    query: { date: `${date.getTime()}` },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch recurrence rules')
  }

  const rules = await response.json()
  return rules.map((rule) => ({
    ...rule,
    startTime: new Date(rule.startTime),
    endTime: new Date(rule.endTime),
    endDate: rule.endDate ? new Date(rule.endDate) : null,
    createdAt: new Date(rule.createdAt),
    updatedAt: new Date(rule.updatedAt),
  }))
}
