'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@doc/design-system/components/ui/popover'
import Theme from '@doc/design-system/components/theme/theme'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function HeaderTheme() {
  const { resolvedTheme } = useTheme()
  return (
    <Popover>
      <PopoverTrigger>
        <div className="h-full aspect-square flex items-center justify-center hover:bg-muted transition-colors duration-300 cursor-pointer text-muted-foreground hover:text-foreground size-12">
          {resolvedTheme === 'light' ? <Sun /> : <Moon />}
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Theme />
      </PopoverContent>
    </Popover>
  )
}
