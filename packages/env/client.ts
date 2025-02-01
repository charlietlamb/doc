import { z } from 'zod'

export const client = {
  // Public URLs
  NEXT_PUBLIC_DOMAIN: z.string().min(1),
  NEXT_PUBLIC_WEB: z.string().min(1).url(),
  NEXT_PUBLIC_API: z.string().min(1).url(),
} as const
