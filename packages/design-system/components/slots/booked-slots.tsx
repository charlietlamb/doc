'use client'

import { useEffect, useState } from 'react'
import { Slot } from '@doc/database/schema/slots'
import { getBookedSlots } from '@doc/design-system/actions/slots/get-booked-slots'
import { ScrollArea } from '@doc/design-system/components/ui/scroll-area'
import { toast } from 'sonner'
import { format } from 'date-fns'
import DatePicker from '@doc/design-system/components/form/date-picker'
import { useForm } from 'react-hook-form'
import { Form } from '@doc/design-system/components/ui/form'
import {
  dateAtom,
  doctorAtom,
} from '@doc/design-system/atoms/doctor/doctor-atoms'
import { useAtomValue } from 'jotai'

export function BookedSlots() {
  const [slots, setSlots] = useState<Slot[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const selectedDate = useAtomValue(dateAtom)
  const doctor = useAtomValue(doctorAtom)

  const form = useForm<FormData>({
    defaultValues: {
      date: new Date(),
    },
  })

  useEffect(() => {
    async function fetchSlots() {
      if (!doctor?.id) return
      setIsLoading(true)
      try {
        const data = await getBookedSlots(
          doctor.id,
          format(selectedDate, 'yyyy-MM-dd')
        )
        setSlots(
          data.map((slot: Slot) => ({
            ...slot,
            createdAt: new Date(slot.createdAt),
            updatedAt: new Date(slot.updatedAt),
            startTime: new Date(slot.startTime),
            endTime: new Date(slot.endTime),
          }))
        )
      } catch (error) {
        toast.error('Failed to fetch booked slots')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSlots()
  }, [doctor?.id, selectedDate])

  if (isLoading) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Loading booked slots...
      </div>
    )
  }

  if (!doctor?.id) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Please select a doctor
      </div>
    )
  }

  if (!slots.length) {
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
          {slots.map((slot) => (
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
