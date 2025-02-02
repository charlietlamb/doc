'use client'

import { useState, useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { slotFormSchema } from '@doc/database/schema/slots'
import { Button } from '@doc/design-system/components/ui/button'
import { Form, FormField } from '@doc/design-system/components/ui/form'
import { toast } from 'sonner'
import { createSlot } from '@doc/design-system/actions/slots/create-slot'
import DateTimePicker from '@doc/design-system/components/form/date-time-picker'
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

const recurrenceSchema = z.object({
  recurrenceType: z.enum(['once', 'daily', 'weekly']),
  weekdays: z.number().int().min(0).max(127).optional(),
  endDate: z.date().optional(),
})

interface FormData {
  startTime: Date
  endTime: Date
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

export function CreateSlot({ doctorId, selectedDate }: CreateSlotProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [maxSlots, setMaxSlots] = useState(1)

  const initialStartTime = roundToNext15Minutes(selectedDate || new Date())
  const initialEndTime = addMinutes(initialStartTime, 30)

  const form = useForm<FormData>({
    resolver: zodResolver(
      slotFormSchema.extend({
        duration: z.number().refine((val) => val === 15 || val === 30, {
          message: 'Duration must be either 15 or 30 minutes',
        }),
        numberOfSlots: z.number().min(1),
        recurrence: recurrenceSchema,
      })
    ),
    defaultValues: {
      startTime: initialStartTime,
      endTime: initialEndTime,
      doctorId: doctorId,
      duration: 30,
      numberOfSlots: 1,
      recurrence: {
        recurrenceType: 'once',
        weekdays: 0,
      },
    },
  })

  useEffect(() => {
    form.setValue('doctorId', doctorId)
  }, [doctorId, form])

  const recurrence = form.watch('recurrence')
  const duration = form.watch('duration')
  const startTime = form.watch('startTime')

  useEffect(() => {
    const newMaxSlots = calculateMaxSlots(startTime, duration)
    setMaxSlots(newMaxSlots)
    // If current selected slots is more than new max, update it
    const currentSlots = form.getValues('numberOfSlots')
    if (currentSlots > newMaxSlots) {
      form.setValue('numberOfSlots', newMaxSlots)
    }
  }, [startTime, duration, form])

  const onSubmit = async (data: FormData) => {
    console.log('Form submitted with data:', data)
    try {
      if (!doctorId) {
        toast.error('Please select a doctor first')
        return
      }
      setIsLoading(true)

      const slots = Array.from({ length: data.numberOfSlots }, (_, index) => {
        const slotStartTime = addMinutes(data.startTime, index * data.duration)
        const slotEndTime = addMinutes(slotStartTime, data.duration)
        return {
          ...data,
          doctorId,
          startTime: slotStartTime,
          endTime: slotEndTime,
        }
      })

      console.log('Creating slots with data:', slots)

      // Create all slots in parallel
      await Promise.all(slots.map((slot) => createSlot(slot)))

      toast.success(
        `${data.numberOfSlots} slot${data.numberOfSlots > 1 ? 's' : ''} created successfully`
      )
      form.reset({
        startTime: roundToNext15Minutes(new Date()),
        endTime: addMinutes(roundToNext15Minutes(new Date()), 30),
        doctorId: doctorId,
        duration: 30,
        numberOfSlots: 1,
        recurrence: {
          recurrenceType: 'once',
          weekdays: 0,
        },
      })
    } catch (error) {
      console.error('Failed to create slots:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to create slots'
      )
    } finally {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <DateTimePicker
            control={form.control}
            name="startTime"
            label="Start Time"
            required
            className="md:col-span-2"
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
            <DateTimePicker
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
