import React from 'react'
import Slots from '@doc/design-system/components/slots/slots'
import { getDoctors } from '@doc/design-system/actions/doctors/get-doctors'

export default async function SlotsPage() {
  const doctors = await getDoctors()
  if ('error' in doctors) {
    return <div>Error: {doctors.error}</div>
  }
  return <Slots doctors={doctors} />
}
