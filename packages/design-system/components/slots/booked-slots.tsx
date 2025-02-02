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

interface BookedSlotsProps {
  doctorId?: string
}

interface FormData {
  date: Date
}

export function BookedSlots({ doctorId }: BookedSlotsProps) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    defaultValues: {
      date: new Date(),
    },
  })

  const selectedDate = form.watch('date')

  useEffect(() => {
    async function fetchSlots() {
      if (!doctorId) return
      setIsLoading(true)
      try {
        const data = await getBookedSlots(
          doctorId,
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
  }, [doctorId, selectedDate])

  if (isLoading) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Loading booked slots...
      </div>
    )
  }

  if (!doctorId) {
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
      <Form {...form}>
        <DatePicker
          control={form.control}
          name="date"
          label="Select Date"
          required
        />
      </Form>
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
