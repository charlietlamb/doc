'use client'

import { ScrollArea } from '@doc/design-system/components/ui/scroll-area'
import { format } from 'date-fns'
import {
  doctorAtom,
  bookedSlotsAtom,
} from '@doc/design-system/atoms/doctor/doctor-atoms'
import { useAtomValue } from 'jotai'

export function BookedSlots() {
  const doctor = useAtomValue(doctorAtom)
  const bookedSlots = useAtomValue(bookedSlotsAtom)

  if (!doctor?.id) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Please select a doctor
      </div>
    )
  }

  if (!bookedSlots.length) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No booked slots
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ScrollArea className="h-[300px] w-full">
        <div className="space-y-4">
          {bookedSlots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between p-2 rounded-lg border"
            >
              <div>
                <p className="font-medium">
                  {format(new Date(slot.startTime), 'h:mm a')} -{' '}
                  {format(new Date(slot.endTime), 'h:mm a')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(slot.startTime), 'MMMM d, yyyy')}
                </p>
              </div>
              <div className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full">
                Booked
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
