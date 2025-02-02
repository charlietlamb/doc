import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '@doc/design-system/styles/globals.css'
import Header from '@doc/design-system/components/header/header'
import { Providers } from '@doc/design-system/components/providers/providers'
import { getDoctors } from '@doc/design-system/actions/doctors/get-doctors'
import { Outfit } from 'next/font/google'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const outfit = Outfit({
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-outfit',
})

export const metadata: Metadata = {
  title: 'Doc demo',
  description: 'Charlie Lamb doc demo',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const doctors = await getDoctors()
  const doctorsWithDateObjects = doctors.map((doctor) => ({
    ...doctor,
    createdAt: new Date(doctor.createdAt),
    updatedAt: new Date(doctor.updatedAt),
  }))

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${outfit.variable} antialiased`}>
        <Providers doctors={doctorsWithDateObjects ?? []}>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
