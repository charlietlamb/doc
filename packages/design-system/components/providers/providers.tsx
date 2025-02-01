'use client'

import ThemeProvider from './theme-provider'
import CustomThemeProvider from './custom-theme-provider'
import { TooltipProvider } from '@doc/design-system/components/ui/tooltip'
import { Toaster } from '@doc/design-system/components/ui/toaster'
import { SonnerProvider } from './sonner'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <CustomThemeProvider>
        <TooltipProvider>
          <Toaster />
          {children}
        </TooltipProvider>
      </CustomThemeProvider>
      <SonnerProvider />
    </ThemeProvider>
  )
}
