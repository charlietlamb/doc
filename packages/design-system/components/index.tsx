import CreateDoctor from './doctor/create-doctor'
import { Doctors } from './doctor/doctors'
import { Doctor } from '@doc/database/schema/doctors'

export default function Index({ doctors }: { doctors: Doctor[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <Doctors doctors={doctors} />
      <CreateDoctor />
    </div>
  )
}
