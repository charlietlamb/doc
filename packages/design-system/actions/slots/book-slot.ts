import client from '@doc/design-system/lib/client'
import type { BookSlotRoute } from '@doc/hono/routes/slots/slots.routes'

export async function bookSlot(slotId: string) {
  const response = await client.slots[':slotId'].book.$post({
    param: { slotId },
  })

  if (!response.ok) {
    throw new Error('Failed to book slot')
  }

  return response.json()
}
