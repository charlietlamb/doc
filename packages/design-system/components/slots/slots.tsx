'use client'

import { Slot } from '@doc/database/schema/slots'
import { Doctor } from '@doc/database/schema/doctors'
import { DoctorSelect } from '@doc/design-system/components/slots/doctor-select'
import { CreateSlot } from '@doc/design-system/components/slots/create-slot'
import { AvailableSlots } from '@doc/design-system/components/slots/available-slots'
import { BookedSlots } from '@doc/design-system/components/slots/booked-slots'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@doc/design-system/components/ui/card'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'

export interface SlotsPageProps {
  doctors: Doctor[]
  initialSlots?: Slot[]
}

interface DateForm {
  selectedDate: Date
}

export default function Slots({ doctors, initialSlots }: SlotsPageProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<string>()
  const form = useForm<DateForm>({
    defaultValues: {
      selectedDate: new Date(),
    },
  })

  const selectedDate = form.watch('selectedDate')

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="w-full">
        <DoctorSelect
          doctors={doctors}
          onSelect={setSelectedDoctor}
          value={selectedDoctor}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Create Slot</CardTitle>
            <CardDescription>
              Create new appointment slots for patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateSlot doctorId={selectedDoctor} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Available Slots</CardTitle>
            <CardDescription>
              View and manage open appointment slots
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AvailableSlots
              doctorId={selectedDoctor}
              date={format(selectedDate, 'yyyy-MM-dd')}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading">Booked Slots</CardTitle>
            <CardDescription>View all confirmed appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <BookedSlots
              doctorId={selectedDoctor}
              date={format(selectedDate, 'yyyy-MM-dd')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
