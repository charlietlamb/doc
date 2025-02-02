'use client'

import { DoctorSelect } from '@doc/design-system/components/slots/doctor-select'
import { AvailableSlots } from '@doc/design-system/components/slots/available-slots'
import { BookedSlots } from '@doc/design-system/components/slots/booked-slots'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@doc/design-system/components/ui/card'
import DatePickerJotai from '../form/date-picker-jotai'
import CreateSlotDialog from './create-slot-dialog'
import { Button } from '../ui/button'

export default function Slots() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <DoctorSelect />
        <DatePickerJotai name="date" label="Date" required />
      </div>
      <div className="grid gap-6">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <div className="flex flex-col">
              <CardTitle className="font-heading">Available Slots</CardTitle>
              <CardDescription>
                View and manage open appointment slots
              </CardDescription>
            </div>
            <CreateSlotDialog>
              <Button variant="shine">Create Slot</Button>
            </CreateSlotDialog>
          </CardHeader>
          <CardContent>
            <AvailableSlots />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <div className="flex flex-col">
              <CardTitle className="font-heading">Booked Slots</CardTitle>
              <CardDescription>
                View and manage booked appointment slots
              </CardDescription>
            </div>
            <CreateSlotDialog>
              <Button variant="shine">Create Slot</Button>
            </CreateSlotDialog>
          </CardHeader>
          <CardContent>
            <BookedSlots />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
