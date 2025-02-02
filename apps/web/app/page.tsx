import Index from '@doc/design-system/components/index'
import { getDoctors } from '@doc/design-system/actions/doctors/get-doctors'

export default async function Home() {
  const doctors = await getDoctors()
  const doctorsWithDates = doctors.map((doctor) => ({
    ...doctor,
    createdAt: new Date(doctor.createdAt),
    updatedAt: new Date(doctor.updatedAt),
  }))
  return <Index doctors={doctorsWithDates} />
}
