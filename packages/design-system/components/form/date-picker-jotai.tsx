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
import RequiredLabel from '@doc/design-system/components/form/required-label'
import { useAtom } from 'jotai'
import { dateAtom } from '@doc/design-system/atoms/doctor/doctor-atoms'

export default function DatePickerJotai({
  name,
  label,
  placeholder = 'Select a date',
  required,
  className,
}: {
  name: string
  label: string
  placeholder?: string
  required?: boolean
  className?: string
}) {
  const [selectedDate, setSelectedDate] = useAtom(dateAtom)

  return (
    <>
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
                !selectedDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="size-4 mr-2" />
              {selectedDate ? (
                format(selectedDate, 'PPP')
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate ?? undefined}
              onSelect={(date) => setSelectedDate(date ?? null)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
}
