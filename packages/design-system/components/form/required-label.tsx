import { Label } from '@doc/design-system/components/ui/label'
import { cn } from '@doc/design-system/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@doc/design-system/components/ui/tooltip'
import Required from '@doc/design-system/components/form/required'

export default function RequiredLabel({
  className,
  htmlFor,
  children,
  required = true,
}: {
  className?: string
  htmlFor?: string
  children: React.ReactNode
  required?: boolean
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Label
          className={cn('font-heading font-bold w-fit text-base', className)}
          htmlFor={htmlFor}
        >
          {children}
          {required && <Required />}
        </Label>
      </TooltipTrigger>
      <TooltipContent>{`${children}${required ? ' is required.' : ''}`}</TooltipContent>
    </Tooltip>
  )
}
