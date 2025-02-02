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
import {
  ScrollArea,
  ScrollBar,
} from '@doc/design-system/components/ui/scroll-area'
import RequiredLabel from '@doc/design-system/components/form/required-label'
import { Control } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@doc/design-system/components/ui/form'

function roundToNext15Minutes(date: Date): Date {
  const roundedDate = new Date(date)
  const minutes = date.getMinutes()
  const hours = date.getHours()

  // Round up to the next 15 minute interval
  const intervalSize = 15
  const roundedMinutes = Math.ceil(minutes / intervalSize) * intervalSize

  if (roundedMinutes === 60) {
    roundedDate.setHours(hours + 1)
    roundedDate.setMinutes(0)
  } else {
    roundedDate.setMinutes(roundedMinutes)
  }

  roundedDate.setSeconds(0)
  roundedDate.setMilliseconds(0)

  return roundedDate
}

interface DateTimePickerProps {
  control: Control<any>
  name: string
  label: string
  placeholder?: string
  required?: boolean
  className?: string
}

export default function DateTimePicker({
  control,
  name,
  label,
  placeholder = 'MM/DD/YYYY HH:mm',
  required,
  className,
}: DateTimePickerProps) {
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
                  variant={'outline'}
                  className={cn(
                    'w-full pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {field.value ? (
                    format(field.value, 'MM/dd/yyyy HH:mm')
                  ) : (
                    <span>{placeholder}</span>
                  )}
                  <CalendarIcon className="size-4 ml-auto opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="sm:flex">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date: Date | undefined) => {
                      if (date) {
                        const newDate = new Date(date)
                        if (field.value) {
                          newDate.setHours(field.value.getHours())
                          newDate.setMinutes(field.value.getMinutes())
                        }
                        field.onChange(newDate)
                      }
                    }}
                    initialFocus
                  />
                  <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                    <ScrollArea className="sm:w-auto w-64">
                      <div className="sm:flex-col flex p-2">
                        {Array.from({ length: 24 }, (_, i) => i)
                          .reverse()
                          .map((hour) => (
                            <Button
                              key={hour}
                              size="icon"
                              variant={
                                field.value && field.value.getHours() === hour
                                  ? 'default'
                                  : 'ghost'
                              }
                              className="sm:w-full shrink-0 aspect-square"
                              onClick={() => {
                                const newDate = new Date(
                                  field.value ||
                                    roundToNext15Minutes(new Date())
                                )
                                newDate.setHours(hour)
                                field.onChange(newDate)
                              }}
                            >
                              {hour}
                            </Button>
                          ))}
                      </div>
                      <ScrollBar
                        orientation="horizontal"
                        className="sm:hidden"
                      />
                    </ScrollArea>
                    <ScrollArea className="sm:w-auto w-64">
                      <div className="sm:flex-col flex p-2">
                        {Array.from({ length: 4 }, (_, i) => i * 15).map(
                          (minute) => (
                            <Button
                              key={minute}
                              size="icon"
                              variant={
                                field.value &&
                                field.value.getMinutes() === minute
                                  ? 'default'
                                  : 'ghost'
                              }
                              className="sm:w-full shrink-0 aspect-square"
                              onClick={() => {
                                const newDate = new Date(
                                  field.value ||
                                    roundToNext15Minutes(new Date())
                                )
                                newDate.setMinutes(minute)
                                field.onChange(newDate)
                              }}
                            >
                              {minute.toString().padStart(2, '0')}
                            </Button>
                          )
                        )}
                      </div>
                      <ScrollBar
                        orientation="horizontal"
                        className="sm:hidden"
                      />
                    </ScrollArea>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
