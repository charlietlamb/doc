import { Doctor } from '@doc/database/schema/doctors'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@doc/design-system/components/ui/select'
import { doctorsAtom } from '@doc/design-system/atoms/doctor/doctor-atoms'
import { useAtom, useAtomValue } from 'jotai'
import { doctorAtom } from '@doc/design-system/atoms/doctor/doctor-atoms'
import RequiredLabel from '../form/required-label'

export function DoctorSelect() {
  const doctors = useAtomValue(doctorsAtom)
  const [doctor, setDoctor] = useAtom(doctorAtom)
  return (
    <div className="flex flex-col gap-2">
      <RequiredLabel>Select a doctor</RequiredLabel>
      <Select
        onValueChange={(value) => {
          setDoctor(doctors.find((doctor) => doctor.id === value) || null)
        }}
        value={doctor?.id}
        defaultValue={doctor?.id}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a doctor" />
        </SelectTrigger>
        <SelectContent>
          {doctors.map((doctor) => (
            <SelectItem key={doctor.id} value={doctor.id}>
              Dr. {doctor.firstName} {doctor.lastName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
