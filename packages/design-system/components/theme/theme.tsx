import { cn } from '@doc/design-system/lib/utils'
import BasicTheme from './basic-theme'
import CustomTheme from './custom-theme'

export default function Theme({
  showLabel = true,
  className,
}: {
  showLabel?: boolean
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {showLabel && (
        <div>
          <p className="font-heading font-bold">Theme</p>
          <p className="text-sm text-muted-foreground">
            Select the theme you want to use for your account.
          </p>
        </div>
      )}
      <BasicTheme />
      <CustomTheme />
    </div>
  )
}
