'use client'
import { useAtom, useAtomValue } from 'jotai'
import {
  dateAtom,
  doctorAtom,
  doctorsAtom,
} from '@doc/design-system/atoms/doctor/doctor-atoms'
import { useEffect } from 'react'
import { Doctor } from '@doc/database/schema'
import {
  availableSlotsAtom,
  bookedSlotsAtom,
} from '@doc/design-system/atoms/doctor/doctor-atoms'
import { useSetAtom } from 'jotai'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '../../lib/query-keys'
import { getBookedSlots } from '@doc/design-system/actions/slots/get-booked-slots'
import { getAvailableSlots } from '@doc/design-system/actions/slots/get-available-slots'
import { getDoctors } from '../../actions/doctors/get-doctors'

export default function AppProvider({
  initialDoctors,
  children,
}: {
  initialDoctors: Doctor[]
  children: React.ReactNode
}) {
  const [doctor, setDoctor] = useAtom(doctorAtom)
  const [doctors, setDoctors] = useAtom(doctorsAtom)
  const date = useAtomValue(dateAtom)
  const setAvailableSlots = useSetAtom(availableSlotsAtom)
  const setBookedSlots = useSetAtom(bookedSlotsAtom)

  const { data: bookedSlots } = useQuery({
    queryKey: [QUERY_KEYS.BOOKED_SLOTS, doctor?.id],
    queryFn: () => doctor && getBookedSlots(doctor.id, date.toISOString()),
  })
  const { data: availableSlots } = useQuery({
    queryKey: [QUERY_KEYS.AVAILABLE_SLOTS, doctor?.id],
    queryFn: () => doctor && getAvailableSlots(doctor.id, date.toISOString()),
  })

  const { data: fetchedDoctors } = useQuery({
    queryKey: [QUERY_KEYS.DOCTORS],
    queryFn: () => getDoctors(),
    initialData: initialDoctors as Doctor[],
  })

  useEffect(() => {
    setBookedSlots(
      bookedSlots?.sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime()
      ) || []
    )
    setAvailableSlots(
      availableSlots?.sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime()
      ) || []
    )
  }, [bookedSlots, availableSlots])

  useEffect(() => {
    if (fetchedDoctors) {
      setDoctors(fetchedDoctors)
      if (!doctor) {
        setDoctor(fetchedDoctors[0])
      }
    }
  }, [fetchedDoctors])

  return children
}
