'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HeaderTheme } from './header-theme'
import { cn } from '@doc/design-system/lib/utils'

export default function Header() {
  const pathname = usePathname()

  return (
    <div className="p-4 flex justify-between items-center border-b">
      <Link href="/">
        <h2 className="text-lg font-bold">doc</h2>
      </Link>
      <div className="flex items-center gap-4">
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
            pathname === '/slots' ? 'text-foreground' : 'text-muted-foreground',
            'hover:text-foreground transition-colors duration-300'
          )}
        >
          Slots
        </Link>
        <HeaderTheme />
      </div>
    </div>
  )
}
