'use client'

import { Toaster } from 'sonner'

export function SonnerProvider() {
  return <Toaster position="top-right" expand={false} richColors closeButton />
}
