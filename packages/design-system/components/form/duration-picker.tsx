'use client'

import { Control, FieldValues, Path } from 'react-hook-form'
import RequiredLabel from '@doc/design-system/components/form/required-label'
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@doc/design-system/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@doc/design-system/components/ui/select'
import { cn } from '@doc/design-system/lib/utils'
import { Clock } from 'lucide-react'

interface DurationPickerProps<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  required?: boolean
  className?: string
}

export default function DurationPicker<T extends FieldValues>({
  control,
  name,
  label,
  required,
  className,
}: DurationPickerProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('flex flex-col gap-2', className)}>
          <RequiredLabel htmlFor={name} required={required}>
            {label}
          </RequiredLabel>
          <FormControl>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 start-0 z-10 flex items-center justify-center ps-3 text-muted-foreground/80">
                <Clock size={16} strokeWidth={2} aria-hidden="true" />
              </div>
              <Select
                value={field.value?.toString()}
                onValueChange={(value) =>
                  field.onChange(parseInt(value) as 15 | 30)
                }
                defaultValue="30"
              >
                <SelectTrigger className="ps-9">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
