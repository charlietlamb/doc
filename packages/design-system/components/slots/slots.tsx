'use client'

import { DoctorSelect } from '@doc/design-system/components/slots/doctor-select'
import { CreateSlot } from '@doc/design-system/components/slots/create-slot'
import { AvailableSlots } from '@doc/design-system/components/slots/available-slots'
import { BookedSlots } from '@doc/design-system/components/slots/booked-slots'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@doc/design-system/components/ui/card'
import { useForm } from 'react-hook-form'

interface DateForm {
  selectedDate: Date
}

export default function Slots() {
  const form = useForm<DateForm>({
    defaultValues: {
      selectedDate: new Date(),
    },
  })

  const selectedDate = form.watch('selectedDate')

  return (
    <div className="container mx-auto p-6 space-y-8">
      <DoctorSelect />
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-heading">Create Slots</CardTitle>
            <CardDescription>
              Create new appointment slots with recurrence options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CreateSlot selectedDate={selectedDate} />
            </div>
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
            <AvailableSlots />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading">Booked Slots</CardTitle>
            <CardDescription>View all confirmed appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <BookedSlots />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
