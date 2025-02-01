import Index from '@doc/design-system/components/index'
import { getDoctors } from '@doc/design-system/actions/doctors/get-doctors'

export default async function Home() {
  const doctors = await getDoctors()
  if ('error' in doctors) {
    return <div>Error: {doctors.error}</div>
  }
  return <Index doctors={doctors} />
}
