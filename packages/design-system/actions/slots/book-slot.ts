'use server'

import client from '@doc/design-system/lib/client'

export async function bookSlot(slotId: string) {
  const response = await client.slots[':slotId'].book.$post({
    param: { slotId },
  })

  if (!response.ok) {
    throw new Error('Failed to book slot')
  }

  return response.json()
}
