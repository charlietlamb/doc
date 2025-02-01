'use client'

import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { cn } from '@doc/design-system/lib/utils'
import { Button } from '@doc/design-system/components/ui/button'
import { Calendar } from '@doc/design-system/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@doc/design-system/components/ui/popover'
import { Control } from 'react-hook-form'
import RequiredLabel from '@doc/design-system/components/form/required-label'
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@doc/design-system/components/ui/form'

interface DatePickerProps {
  control: Control<any>
  name: string
  label: string
  placeholder?: string
  required?: boolean
  className?: string
}

export default function DatePicker({
  control,
  name,
  label,
  placeholder = 'Select a date',
  required,
  className,
}: DatePickerProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('flex flex-col gap-2', className)}>
          <RequiredLabel htmlFor={name} required={required}>
            {label}
          </RequiredLabel>
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id={name}
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="size-4 mr-2" />
                  {field.value ? (
                    format(field.value, 'PPP')
                  ) : (
                    <span>{placeholder}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
