'use server'

import client from '@doc/design-system/lib/client'

export async function getDoctors() {
  const response = await client.doctors.$get()
  const json = await response.json()
  if ('error' in json) {
    throw new Error(json.error)
  }
  return json
}
