'use server'

import client from '@doc/design-system/lib/client'

export async function getDoctors() {
  const response = await client.doctors.$get()
  if ('error' in response) {
    throw new Error(response.error)
  }
  return response.json()
}
