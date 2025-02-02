import CreateDoctor from './doctor/create-doctor'
import { Doctors } from './doctor/doctors'

export default function Index() {
  return (
    <div className="grid md:grid-cols-2 gap-4 p-4">
      <Doctors />
      <CreateDoctor />
    </div>
  )
}
