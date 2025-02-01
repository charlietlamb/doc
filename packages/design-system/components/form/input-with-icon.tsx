'use client'

import { Input } from '@doc/design-system/components/ui/input'
import { cn } from '@doc/design-system/lib/utils'
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@doc/design-system/components/ui/form'
import { cloneElement } from 'react'
import { Control } from 'react-hook-form'
import RequiredLabel from '@doc/design-system/components/form/required-label'

interface InputWithIconProps {
  name: string
  label: string
  placeholder: string
  icon: React.ReactElement
  type?: 'text' | 'email' | 'password'
  required?: boolean
  className?: string
  control: Control<any>
}

export default function InputWithIcon({
  control,
  name,
  label,
  placeholder,
  icon,
  type = 'text',
  required,
  className,
}: InputWithIconProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className={className}>
          <RequiredLabel htmlFor={name} required={required}>
            {label}
          </RequiredLabel>
          <div className="relative">
            <FormControl>
              <Input
                placeholder={placeholder}
                type={type}
                className={cn(
                  'pe-9 transition-colors focus-visible:ring-accent',
                  error &&
                    'border-destructive/80 text-destructive focus-visible:border-destructive/80 focus-visible:ring-destructive/30'
                )}
                {...field}
                id={name}
              />
            </FormControl>
            <div className="end-0 pe-3 text-muted-foreground/60 peer-disabled:opacity-50 absolute inset-y-0 flex items-center justify-center pointer-events-none">
              {cloneElement(icon, {
                size: 16,
                strokeWidth: 2,
                'aria-hidden': true,
                className: cn(
                  'transition-colors group-hover:text-muted-foreground/70',
                  error && 'text-destructive/80'
                ),
              })}
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
