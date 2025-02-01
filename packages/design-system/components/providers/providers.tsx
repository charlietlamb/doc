import ThemeProvider from './theme-provider'
import CustomThemeProvider from './custom-theme-provider'
import { TooltipProvider } from '@doc/design-system/components/ui/tooltip'
import { Toaster } from '@doc/design-system/components/ui/toaster'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <CustomThemeProvider>
        <TooltipProvider>
          <Toaster />
          {children}
        </TooltipProvider>
      </CustomThemeProvider>
    </ThemeProvider>
  )
}
