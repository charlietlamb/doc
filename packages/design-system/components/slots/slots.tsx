'use client'

import { DoctorSelect } from '@doc/design-system/components/slots/doctor-select'
import { AvailableSlots } from '@doc/design-system/components/slots/available-slots'
import { BookedSlots } from '@doc/design-system/components/slots/booked-slots'
import DatePickerJotai from '../form/date-picker-jotai'
import CreateSlotDialog from './create-slot-dialog'
import { Button } from '../ui/button'
import { Separator } from 'react-aria-components'

export default function Slots() {
  return (
    <div className="container p-6 space-y-8">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-heading font-bold">Slots</h1>
          <p className="text-muted-foreground">
            View and manage appointment slots
          </p>
        </div>
        <CreateSlotDialog>
          <Button variant="shine">Create Slot</Button>
        </CreateSlotDialog>
      </div>
      <Separator />
      <div className="grid md:grid-cols-2 gap-6">
        <DoctorSelect />
        <DatePickerJotai name="date" label="Date" required />
      </div>
      <Separator />
      <div className="grid gap-6">
        <div className="rounded-lg bg-card text-card-foreground flex flex-col gap-4">
          <div className="flex flex-col space-y-1.5">
            <h3 className="font-heading text-2xl font-semibold leading-none tracking-tight">
              Available Slots
            </h3>
            <p className="text-sm text-muted-foreground">
              View and manage open appointment slots
            </p>
          </div>
          <AvailableSlots />
        </div>
        <Separator />

        <div className="rounded-lg bg-card text-card-foreground flex flex-col gap-4">
          <div className="flex flex-col space-y-1.5">
            <h3 className="font-heading text-2xl font-semibold leading-none tracking-tight">
              Booked Slots
            </h3>
            <p className="text-sm text-muted-foreground">
              View all confirmed appointments
            </p>
          </div>
          <BookedSlots />
        </div>
      </div>
    </div>
  )
}
