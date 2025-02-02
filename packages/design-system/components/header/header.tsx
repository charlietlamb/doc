'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HeaderTheme } from './header-theme'
import { cn } from '@doc/design-system/lib/utils'
import { Activity } from 'lucide-react'
import { Separator } from '../ui/separator'

export default function Header() {
  const pathname = usePathname()

  return (
    <div className="pl-4 flex justify-between items-center border-b">
      <Link
        href="/"
        className="flex items-center gap-2 text-primary font-heading"
      >
        <Activity className="w-4 h-4" />
        Lightwork
      </Link>
      <div className="flex items-center">
        <div className="flex items-center gap-4 pr-4">
          <Link
            href="/"
            className={cn(
              'font-heading',
              pathname === '/' ? 'text-foreground' : 'text-muted-foreground',
              'hover:text-foreground transition-colors duration-300'
            )}
          >
            Home
          </Link>
          <Link
            href="/slots"
            className={cn(
              'font-heading',
              pathname === '/slots'
                ? 'text-foreground'
                : 'text-muted-foreground',
              'hover:text-foreground transition-colors duration-300'
            )}
          >
            Slots
          </Link>
        </div>
        <Separator orientation="vertical" className="h-12" />
        <HeaderTheme />
      </div>
    </div>
  )
}
