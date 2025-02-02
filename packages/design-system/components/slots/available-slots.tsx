'use client'

import { useState } from 'react'
import { getAvailableSlots } from '@doc/design-system/actions/slots/get-available-slots'
import { ScrollArea } from '@doc/design-system/components/ui/scroll-area'
import { Button } from '@doc/design-system/components/ui/button'
import { toast } from 'sonner'
import { bookSlot } from '@doc/design-system/actions/slots/book-slot'
import { format } from 'date-fns'
import { useAtomValue } from 'jotai'
import {
  doctorAtom,
  dateAtom,
  availableSlotsAtom,
} from '@doc/design-system/atoms/doctor/doctor-atoms'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '../../lib/query-keys'

export function AvailableSlots() {
  const [bookingId, setBookingId] = useState<string>()
  const doctor = useAtomValue(doctorAtom)
  const selectedDate = useAtomValue(dateAtom)
  const availableSlots = useAtomValue(availableSlotsAtom)
  const queryClient = useQueryClient()
  async function handleBook(slotId: string) {
    if (!doctor?.id) return
    setBookingId(slotId)
    try {
      await bookSlot(slotId)
      toast.success('Slot booked successfully')
      await getAvailableSlots(doctor.id, format(selectedDate, 'yyyy-MM-dd'))
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.AVAILABLE_SLOTS, doctor?.id],
      })
    } catch (error) {
      toast.error('Failed to book slot')
    } finally {
      setBookingId(undefined)
    }
  }

  if (!doctor?.id) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Please select a doctor
      </div>
    )
  }

  if (!availableSlots.length) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No available slots
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ScrollArea className="h-[300px] w-full">
        <div className="space-y-4">
          {availableSlots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between p-2 rounded-lg border"
            >
              <div>
                <p className="font-medium">
                  {format(new Date(slot.startTime), 'h:mm a')} -{' '}
                  {format(new Date(slot.endTime), 'h:mm a')}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBook(slot.id)}
                disabled={bookingId === slot.id}
              >
                {bookingId === slot.id ? 'Booking...' : 'Book'}
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
