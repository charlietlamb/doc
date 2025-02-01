'use server'

import client from '@doc/design-system/lib/client'

export async function getDoctors() {
  const response = await client.doctors.$get()
  return response.json()
}
