'use client'

import ThemeProvider from './theme-provider'
import CustomThemeProvider from './custom-theme-provider'
import { TooltipProvider } from '@doc/design-system/components/ui/tooltip'
import { Toaster } from '@doc/design-system/components/ui/toaster'
import { SonnerProvider } from './sonner'
import { Doctor } from '@doc/database/schema/doctors'
import AppProvider from './app-provider'

interface ProvidersProps {
  children: React.ReactNode
  doctors: Doctor[]
}

export function Providers({ doctors, children }: ProvidersProps) {
  const doctorsWithDates = doctors?.map((doctor) => ({
    ...doctor,
    createdAt: new Date(doctor.createdAt),
    updatedAt: new Date(doctor.updatedAt),
  }))
  return (
    <AppProvider initialDoctors={doctorsWithDates}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <CustomThemeProvider>
          <TooltipProvider>
            <Toaster />
            {children}
          </TooltipProvider>
        </CustomThemeProvider>
        <SonnerProvider />
      </ThemeProvider>
    </AppProvider>
  )
}
