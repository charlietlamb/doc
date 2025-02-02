'use client'

import { useEffect, useState } from 'react'
import { Slot } from '@doc/database/schema/slots'
import { getAvailableSlots } from '@doc/design-system/actions/slots/get-available-slots'
import { ScrollArea } from '@doc/design-system/components/ui/scroll-area'
import { Button } from '@doc/design-system/components/ui/button'
import { toast } from 'sonner'
import { bookSlot } from '@doc/design-system/actions/slots/book-slot'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import DatePicker from '@doc/design-system/components/form/date-picker'
import { useForm } from 'react-hook-form'
import { Form } from '@doc/design-system/components/ui/form'

interface AvailableSlotsProps {
  doctorId?: string
}

interface FormData {
  date: Date
}

export function AvailableSlots({ doctorId }: AvailableSlotsProps) {
  const [slots, setSlots] = useState<Slot[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [bookingId, setBookingId] = useState<string>()
  const router = useRouter()

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
        const data = await getAvailableSlots(
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
        toast.error('Failed to fetch available slots')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSlots()
  }, [doctorId, selectedDate])

  async function handleBook(slotId: string) {
    if (!doctorId) return
    setBookingId(slotId)
    try {
      await bookSlot(slotId)
      toast.success('Slot booked successfully')
      const data = await getAvailableSlots(
        doctorId,
        format(selectedDate, 'yyyy-MM-dd')
      )
      setSlots(
        data.map((slot) => ({
          ...slot,
          createdAt: new Date(slot.createdAt),
          updatedAt: new Date(slot.updatedAt),
          startTime: new Date(slot.startTime),
          endTime: new Date(slot.endTime),
        }))
      )
      router.refresh()
    } catch (error) {
      toast.error('Failed to book slot')
    } finally {
      setBookingId(undefined)
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Loading available slots...
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
        No available slots
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
      <ScrollArea className="h-[300px] w-full rounded-md border p-4">
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
