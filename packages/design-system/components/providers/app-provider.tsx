'use client'
import { useAtom } from 'jotai'
import {
  doctorAtom,
  doctorsAtom,
} from '@doc/design-system/atoms/doctor/doctor-atoms'
import { useEffect } from 'react'
import { Doctor } from '@doc/database/schema'

export default function AppProvider({
  initialDoctors,
  children,
}: {
  initialDoctors: Doctor[]
  children: React.ReactNode
}) {
  const [doctor, setDoctor] = useAtom(doctorAtom)
  const [doctors, setDoctors] = useAtom(doctorsAtom)

  useEffect(() => {
    !doctors.length && setDoctors(initialDoctors)
    !!doctors.length && !doctor && setDoctor(initialDoctors[0])
  }, [initialDoctors])

  return children
}
