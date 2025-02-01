'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { slotFormSchema } from '@doc/database/schema/slots'
import { Button } from '@doc/design-system/components/ui/button'
import { Form } from '@doc/design-system/components/ui/form'
import { toast } from 'sonner'
import { createSlot } from '@doc/design-system/actions/slots/create-slot'
import DateTimePicker from '@doc/design-system/components/form/date-time-picker'

interface FormData {
  startTime: Date
  endTime: Date
}

interface CreateSlotProps {
  doctorId?: string
}

export function CreateSlot({ doctorId }: CreateSlotProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(slotFormSchema),
    defaultValues: {
      startTime: new Date(),
      endTime: new Date(),
    },
  })

  async function onSubmit(data: FormData) {
    if (!doctorId) {
      toast.error('Please select a doctor first')
      return
    }

    setIsLoading(true)
    try {
      await createSlot(doctorId, {
        doctorId,
        startTime: data.startTime,
        endTime: data.endTime,
      })
      toast.success('Slot created successfully')
      form.reset()
    } catch (error) {
      toast.error('Failed to create slot')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DateTimePicker
          control={form.control}
          name="startTime"
          label="Start Time"
        />
        <DateTimePicker
          control={form.control}
          name="endTime"
          label="End Time"
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !doctorId}
        >
          {isLoading ? 'Creating...' : 'Create Slot'}
        </Button>
      </form>
    </Form>
  )
}
