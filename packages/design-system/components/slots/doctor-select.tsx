import { Doctor } from '@doc/database/schema/doctors'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@doc/design-system/components/ui/select'

interface DoctorSelectProps {
  doctors: Doctor[]
  onSelect: (value: string) => void
  value?: string
}

export function DoctorSelect({ doctors, onSelect, value }: DoctorSelectProps) {
  return (
    <Select onValueChange={onSelect} value={value}>
      <SelectTrigger className="w-[280px]">
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
  )
}
