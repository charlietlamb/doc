'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { slotFormSchema } from '@doc/database/schema/slots'
import { Button } from '@doc/design-system/components/ui/button'
import { Form } from '@doc/design-system/components/ui/form'
import { toast } from 'sonner'
import { createSlot } from '@doc/design-system/actions/slots/create-slot'
import DatePicker from '@doc/design-system/components/form/date-picker'
import TimePicker from '@doc/design-system/components/form/time-picker'
import DurationPicker from '@doc/design-system/components/form/duration-picker'
import SlotsPicker from '@doc/design-system/components/form/slots-picker'
import Spinner from '../misc/spinner'
import { Checkbox } from '@doc/design-system/components/ui/checkbox'
import { Label } from '@doc/design-system/components/ui/label'
import { endOfDay, differenceInMinutes } from 'date-fns'
import { z } from 'zod'
import RequiredLabel from '../form/required-label'
import { useAtomValue } from 'jotai'
import {
  dateAtom,
  doctorAtom,
} from '@doc/design-system/atoms/doctor/doctor-atoms'
import { createRecurrence } from '@doc/design-system/actions/slots/create-reccurence'
import { QUERY_KEYS } from '../../lib/query-keys'
import { useQueryClient } from '@tanstack/react-query'
import { RECURRENCE_TYPES } from '../../lib/recurrence-types'

const recurrenceSchema = z.object({
  recurrenceType: z.enum(['once', 'daily', 'weekly']),
  weekdays: z.number().int().min(0).max(127).optional(),
  endDate: z.date().optional(),
})

interface FormData {
  date: Date
  time: Date
  duration: 15 | 30
  numberOfSlots: number
  recurrence: z.infer<typeof recurrenceSchema>
  doctorId: string
}

function roundToNext15Minutes(date: Date = new Date()) {
  const minutes = date.getMinutes()
  const remainder = minutes % 15
  const roundedDate = new Date(date)
  if (remainder !== 0) {
    roundedDate.setMinutes(minutes + (15 - remainder))
  }
  roundedDate.setSeconds(0)
  roundedDate.setMilliseconds(0)
  return roundedDate
}

function calculateMaxSlots(startTime: Date, duration: number): number {
  const endOfCurrentDay = endOfDay(startTime)
  const availableMinutes = differenceInMinutes(endOfCurrentDay, startTime)
  return Math.floor(availableMinutes / duration)
}

export function CreateSlot({ onSuccess }: { onSuccess?: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [maxSlots, setMaxSlots] = useState(1)
  const doctor = useAtomValue(doctorAtom)
  const selectedDate = useAtomValue(dateAtom)

  const initialDate = selectedDate || new Date()
  const initialTime = roundToNext15Minutes(initialDate)
  const queryClient = useQueryClient()

  const form = useForm<FormData>({
    resolver: zodResolver(
      slotFormSchema.extend({
        date: z.date(),
        time: z.date(),
        duration: z.number().refine((val) => val === 15 || val === 30, {
          message: 'Duration must be either 15 or 30 minutes',
        }),
        numberOfSlots: z.number().min(1),
        recurrence: recurrenceSchema,
        doctorId: z.string(),
      })
    ),
    defaultValues: {
      date: initialDate,
      time: initialTime,
      duration: 30,
      numberOfSlots: 1,
      doctorId: doctor?.id,
      recurrence: {
        recurrenceType: RECURRENCE_TYPES.ONCE,
        weekdays: 0,
      },
    },
  })

  const recurrence = form.watch('recurrence')
  const duration = form.watch('duration')
  const date = form.watch('date')

  useEffect(() => {
    form.setValue('doctorId', doctor?.id ?? '')
  }, [doctor, form])

  useEffect(() => {
    form.setValue('date', selectedDate ?? new Date())
  }, [selectedDate, form])

  useEffect(() => {
    const newMaxSlots = calculateMaxSlots(new Date(date), duration)
    setMaxSlots(newMaxSlots)
    // If current selected slots is more than new max, update it
    const currentSlots = form.getValues('numberOfSlots')
    if (currentSlots > newMaxSlots) {
      form.setValue('numberOfSlots', newMaxSlots)
    }
  }, [date, duration, form])

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true)

      const baseDate = new Date(data.date)
      baseDate.setHours(0, 0, 0, 0)
      const hours = data.time.getHours()
      const minutes = data.time.getMinutes()
      const startTime = new Date(baseDate)
      startTime.setHours(hours)
      startTime.setMinutes(minutes)

      if (!doctor?.id) {
        throw new Error('Doctor ID is required')
      }

      if (data.recurrence.recurrenceType === RECURRENCE_TYPES.ONCE) {
        const slots = Array.from({ length: data.numberOfSlots }, (_, index) => {
          const slotStartTime = new Date(startTime)
          slotStartTime.setMinutes(
            startTime.getMinutes() + index * data.duration
          )

          const slotEndTime = new Date(slotStartTime)
          slotEndTime.setMinutes(slotStartTime.getMinutes() + data.duration)

          return {
            startTime: slotStartTime,
            endTime: slotEndTime,
            doctorId: doctor.id,
            date: data.date,
            time: data.time,
            duration: data.duration,
          }
        })

        let createdCount = 0
        for (const slot of slots) {
          try {
            await createSlot(slot)
            createdCount++
          } catch (error) {
            console.error('Error creating slot:', error)
            throw error
          }
        }

        if (createdCount > 0) {
          toast.success(
            `${createdCount} slot${createdCount > 1 ? 's' : ''} created successfully`
          )
        }
      } else {
        // Create multiple recurring slots
        for (let i = 0; i < data.numberOfSlots; i++) {
          const slotStartTime = new Date(startTime)
          slotStartTime.setMinutes(startTime.getMinutes() + i * data.duration)

          const slotEndTime = new Date(slotStartTime)
          slotEndTime.setMinutes(slotStartTime.getMinutes() + data.duration)

          await createRecurrence({
            doctorId: doctor.id,
            startTime: slotStartTime,
            endTime: slotEndTime,
            recurrenceType: data.recurrence.recurrenceType as
              | 'once'
              | 'daily'
              | 'weekly',
            weekdays:
              data.recurrence.recurrenceType === RECURRENCE_TYPES.WEEKLY
                ? data.recurrence.weekdays
                : undefined,
            endDate: data.recurrence.endDate,
          })
        }

        toast.success('Recurring slots created successfully')
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.AVAILABLE_SLOTS, doctor?.id],
        })
      }

      form.reset({
        date: new Date(),
        time: roundToNext15Minutes(new Date()),
        duration: 30,
        numberOfSlots: 1,
        recurrence: {
          recurrenceType: RECURRENCE_TYPES.ONCE as 'once',
          weekdays: 0,
        },
      })
    } catch (error) {
      console.error('=== Form Submission Error ===')
      console.error('Error details:', error)
      if (error instanceof Error) {
        console.error('Error name:', error.name)
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
      toast.error(
        error instanceof Error ? error.message : 'Failed to create slots'
      )
    } finally {
      console.log('Form submission completed')
      setIsLoading(false)
      onSuccess?.()
    }
  }

  const handleWeekdayToggle = (dayIndex: number) => {
    const currentWeekdays = form.watch('recurrence.weekdays') || 0
    const dayBit = 1 << dayIndex
    const newWeekdays =
      currentWeekdays & dayBit
        ? currentWeekdays & ~dayBit
        : currentWeekdays | dayBit
    form.setValue('recurrence.weekdays', newWeekdays)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (data) => {
            console.log('Form submitted successfully', data)
            return onSubmit(data)
          },
          (errors) => {
            console.error('Form validation failed:', errors)
            console.error('Current form values:', form.getValues())
            console.error('Form state:', form.formState)
            toast.error('Please check all required fields')
          }
        )}
        className="space-y-6"
        onClick={(e) => {
          console.log('Form clicked', e.target)
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <TimePicker
            control={form.control}
            name="time"
            label="Time"
            required
            className="col-span-2"
          />

          <DurationPicker
            control={form.control}
            name="duration"
            label="Duration"
            required
          />

          <SlotsPicker
            control={form.control}
            name="numberOfSlots"
            label="Number of Slots"
            maxSlots={maxSlots}
            required
          />
        </div>

        <div className="space-y-4">
          <RequiredLabel>Recurrence</RequiredLabel>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                id="once"
                checked={recurrence.recurrenceType === RECURRENCE_TYPES.ONCE}
                onCheckedChange={() =>
                  form.setValue(
                    'recurrence.recurrenceType',
                    RECURRENCE_TYPES.ONCE as 'once'
                  )
                }
                className="cursor-pointer"
              />
              <Label htmlFor="once" className="cursor-pointer">
                One-time
              </Label>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                id="daily"
                checked={recurrence.recurrenceType === RECURRENCE_TYPES.DAILY}
                onCheckedChange={() =>
                  form.setValue(
                    'recurrence.recurrenceType',
                    RECURRENCE_TYPES.DAILY as 'daily'
                  )
                }
                className="cursor-pointer"
              />
              <Label htmlFor="daily" className="cursor-pointer">
                Daily
              </Label>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                id="weekly"
                checked={recurrence.recurrenceType === RECURRENCE_TYPES.WEEKLY}
                onCheckedChange={() =>
                  form.setValue(
                    'recurrence.recurrenceType',
                    RECURRENCE_TYPES.WEEKLY as 'weekly'
                  )
                }
                className="cursor-pointer"
              />
              <Label htmlFor="weekly" className="cursor-pointer">
                Weekly
              </Label>
            </div>
          </div>

          {recurrence.recurrenceType !== RECURRENCE_TYPES.ONCE && (
            <DatePicker
              control={form.control}
              name="recurrence.endDate"
              label="End Date"
            />
          )}

          {recurrence.recurrenceType === RECURRENCE_TYPES.WEEKLY && (
            <div className="space-y-2">
              <Label>Select Days</Label>
              <div className="grid grid-cols-7 gap-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                  (day, index) => (
                    <Button
                      key={day}
                      type="button"
                      variant={
                        (form.watch('recurrence.weekdays') || 0) & (1 << index)
                          ? 'default'
                          : 'outline'
                      }
                      size="sm"
                      onClick={() => handleWeekdayToggle(index)}
                    >
                      {day}
                    </Button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
          variant="shine"
        >
          {isLoading ? <Spinner /> : 'Create Slots'}
        </Button>
      </form>
    </Form>
  )
}
