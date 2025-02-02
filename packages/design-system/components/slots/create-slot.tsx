'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { slotFormSchema } from '@doc/database/schema/slots'
import { Button } from '@doc/design-system/components/ui/button'
import { Form, FormField } from '@doc/design-system/components/ui/form'
import { toast } from 'sonner'
import { createSlot } from '@doc/design-system/actions/slots/create-slot'
import DatePicker from '@doc/design-system/components/form/date-picker'
import TimePicker from '@doc/design-system/components/form/time-picker'
import Spinner from '../misc/spinner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@doc/design-system/components/ui/select'
import { Checkbox } from '@doc/design-system/components/ui/checkbox'
import { Label } from '@doc/design-system/components/ui/label'
import { addMinutes, endOfDay, differenceInMinutes } from 'date-fns'
import { z } from 'zod'
import RequiredLabel from '../form/required-label'
import React from 'react'
import { DoctorSelect } from './doctor-select'
import { getDoctors } from '@doc/design-system/actions/doctors/get-doctors'
import { Doctor } from '@doc/database/schema/doctors'

const recurrenceSchema = z.object({
  recurrenceType: z.enum(['once', 'daily', 'weekly']),
  weekdays: z.number().int().min(0).max(127).optional(),
  endDate: z.date().optional(),
})

interface FormData {
  date: Date
  time: Date
  doctorId?: string
  duration: 15 | 30
  numberOfSlots: number
  recurrence: z.infer<typeof recurrenceSchema>
}

interface CreateSlotProps {
  doctorId?: string
  selectedDate?: Date
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

export function CreateSlot({
  doctorId: initialDoctorId,
  selectedDate,
}: CreateSlotProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [maxSlots, setMaxSlots] = useState(1)
  const [doctors, setDoctors] = useState<Doctor[]>([])

  const initialDate = selectedDate || new Date()
  const initialTime = roundToNext15Minutes(initialDate)

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const fetchedDoctors = await getDoctors()
        setDoctors(fetchedDoctors)

        // If no initial doctorId is provided and we have doctors, set the first one
        if (!initialDoctorId && fetchedDoctors.length > 0) {
          form.setValue('doctorId', fetchedDoctors[0].id)
        }
      } catch (error) {
        console.error('Failed to fetch doctors:', error)
        toast.error('Failed to load doctors')
      }
    }

    fetchDoctors()
  }, [initialDoctorId])

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
      })
    ),
    defaultValues: {
      date: initialDate,
      time: initialTime,
      doctorId: initialDoctorId,
      duration: 30,
      numberOfSlots: 1,
      recurrence: {
        recurrenceType: 'once',
        weekdays: 0,
      },
    },
  })

  const recurrence = form.watch('recurrence')
  const duration = form.watch('duration')
  const date = form.watch('date')
  const time = form.watch('time')

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
    console.log('=== Form Submission Debug Logs ===')
    console.log('Raw form data:', {
      date: data.date.toISOString(),
      time: data.time.toISOString(),
      duration: data.duration,
      numberOfSlots: data.numberOfSlots,
    })

    try {
      const currentDoctorId = data.doctorId
      if (!currentDoctorId) {
        console.log('Submission blocked: Missing doctor ID')
        toast.error('Please select a doctor first')
        return
      }
      setIsLoading(true)

      // Create base date from the selected date, ensuring time is set to midnight
      const baseDate = new Date(data.date)
      baseDate.setHours(0, 0, 0, 0)

      // Get hours and minutes from the time picker
      const hours = data.time.getHours()
      const minutes = data.time.getMinutes()

      // Create the initial start time by adding hours and minutes to the base date
      const startTime = new Date(baseDate)
      startTime.setHours(hours)
      startTime.setMinutes(minutes)

      console.log('Time components:', {
        baseDate: baseDate.toISOString(),
        hours,
        minutes,
        startTime: startTime.toISOString(),
      })

      const slots = Array.from({ length: data.numberOfSlots }, (_, index) => {
        // Calculate slot times using the duration in minutes
        const slotStartTime = new Date(startTime)
        slotStartTime.setMinutes(startTime.getMinutes() + index * data.duration)

        const slotEndTime = new Date(slotStartTime)
        slotEndTime.setMinutes(slotStartTime.getMinutes() + data.duration)

        console.log(`Slot ${index + 1}:`, {
          start: slotStartTime.toISOString(),
          end: slotEndTime.toISOString(),
          duration: data.duration,
        })

        return {
          ...data,
          doctorId: currentDoctorId,
          startTime: slotStartTime,
          endTime: slotEndTime,
        }
      })

      console.log(
        'Generated slots:',
        slots.map((slot) => ({
          startTime: slot.startTime.toISOString(),
          endTime: slot.endTime.toISOString(),
          duration: slot.duration,
          recurrence: slot.recurrence,
        }))
      )

      // Create slots sequentially and stop if there's an overlap
      let createdCount = 0
      for (const slot of slots) {
        try {
          console.log(
            `Attempting to create slot ${createdCount + 1}/${slots.length}`
          )
          await createSlot(slot)
          console.log(`Successfully created slot ${createdCount + 1}`)
          createdCount++
        } catch (error) {
          console.error('Error creating slot:', error)
          if (error instanceof Error) {
            console.error('Error message:', error.message)
            console.error('Error stack:', error.stack)
            if (error.message.includes('overlaps')) {
              toast.error(
                `Slot ${createdCount + 1} overlaps with existing slots. Stopping creation.`
              )
              break
            }
          }
          throw error
        }
      }

      if (createdCount > 0) {
        console.log(`Successfully created ${createdCount} slots`)
        toast.success(
          `${createdCount} slot${createdCount > 1 ? 's' : ''} created successfully`
        )
        form.reset({
          date: new Date(),
          time: roundToNext15Minutes(new Date()),
          doctorId: data.doctorId,
          duration: 30,
          numberOfSlots: 1,
          recurrence: {
            recurrenceType: 'once',
            weekdays: 0,
          },
        })
      }
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
        <div className="space-y-4">
          <RequiredLabel>Doctor</RequiredLabel>
          <DoctorSelect
            doctors={doctors}
            value={form.watch('doctorId')}
            onSelect={(value) => form.setValue('doctorId', value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DatePicker
            control={form.control}
            name="date"
            label="Date"
            required
            className="col-span-2"
          />
          <TimePicker
            control={form.control}
            name="time"
            label="Time"
            required
            className="col-span-2"
          />

          <div className="space-y-4">
            <RequiredLabel>Duration</RequiredLabel>
            <Select
              value={duration.toString()}
              onValueChange={(value) =>
                form.setValue('duration', parseInt(value) as 15 | 30)
              }
              defaultValue="30"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <RequiredLabel>Number of Slots</RequiredLabel>
            <Select
              value={form.watch('numberOfSlots').toString()}
              onValueChange={(value) =>
                form.setValue('numberOfSlots', parseInt(value))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select number of slots" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: maxSlots }, (_, i) => i + 1).map(
                  (num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} slot{num > 1 ? 's' : ''}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <RequiredLabel>Recurrence</RequiredLabel>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 cursor-pointer">
              <Checkbox
                id="once"
                checked={recurrence.recurrenceType === 'once'}
                onCheckedChange={() =>
                  form.setValue('recurrence.recurrenceType', 'once')
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
                checked={recurrence.recurrenceType === 'daily'}
                onCheckedChange={() =>
                  form.setValue('recurrence.recurrenceType', 'daily')
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
                checked={recurrence.recurrenceType === 'weekly'}
                onCheckedChange={() =>
                  form.setValue('recurrence.recurrenceType', 'weekly')
                }
                className="cursor-pointer"
              />
              <Label htmlFor="weekly" className="cursor-pointer">
                Weekly
              </Label>
            </div>
          </div>

          {recurrence.recurrenceType !== 'once' && (
            <DatePicker
              control={form.control}
              name="recurrence.endDate"
              label="End Date"
            />
          )}

          {recurrence.recurrenceType === 'weekly' && (
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
