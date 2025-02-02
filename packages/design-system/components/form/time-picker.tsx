'use client'

import {
  DateInput,
  TimeField,
} from '@doc/design-system/components/form/datefield-rac'
import { Clock } from 'lucide-react'
import { Control, FieldValues, Path } from 'react-hook-form'
import RequiredLabel from '@doc/design-system/components/form/required-label'
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@doc/design-system/components/ui/form'
import { cn } from '@doc/design-system/lib/utils'
import { Time } from '@internationalized/date'
import { TimeValue } from 'react-aria-components'

interface TimePickerProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  required?: boolean
  className?: string
}

export default function TimePicker<T extends FieldValues>({
  control,
  name,
  label,
  required,
  className,
}: TimePickerProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Convert Date to Time
        const value = field.value ? new Date(field.value) : new Date()
        const timeValue = new Time(value.getHours(), value.getMinutes())

        return (
          <FormItem className={cn('flex flex-col gap-2', className)}>
            <RequiredLabel htmlFor={name} required={required}>
              {label}
            </RequiredLabel>
            <FormControl>
              <TimeField<TimeValue>
                className="space-y-2"
                value={timeValue}
                onChange={(time) => {
                  if (time) {
                    const date = new Date()
                    date.setHours(time.hour)
                    date.setMinutes(time.minute)
                    date.setSeconds(0)
                    date.setMilliseconds(0)
                    field.onChange(date)
                  }
                }}
              >
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center justify-center ps-3 text-muted-foreground/80">
                    <Clock size={16} strokeWidth={2} aria-hidden="true" />
                  </div>
                  <DateInput className="ps-9" />
                </div>
              </TimeField>
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
