'use server'

import { DoctorForm } from '@doc/database/schema'
import client from '@doc/design-system/lib/client'

export async function createDoctor(data: DoctorForm) {
  const response = await client.doctors.$post({
    json: data,
  })
  const json = await response.json()
  if ('error' in json) {
    throw new Error(json.error)
  }
  return json
}
