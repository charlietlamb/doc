'use client'
import { useAtom, useAtomValue } from 'jotai'
import {
  dateAtom,
  doctorAtom,
  doctorsAtom,
} from '@doc/design-system/atoms/doctor/doctor-atoms'
import { useEffect } from 'react'
import { Doctor, Slot } from '@doc/database/schema'
import {
  availableSlotsAtom,
  bookedSlotsAtom,
  recurrenceRulesAtom,
} from '@doc/design-system/atoms/doctor/doctor-atoms'
import { useSetAtom } from 'jotai'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '../../lib/query-keys'
import { getBookedSlots } from '@doc/design-system/actions/slots/get-booked-slots'
import { getAvailableSlots } from '@doc/design-system/actions/slots/get-available-slots'
import { getReccurenceRules } from '@doc/design-system/actions/slots/get-reccurence-rules'
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
  const setRecurrenceRules = useSetAtom(recurrenceRulesAtom)

  const { data: bookedSlots, refetch: refetchBookedSlots } = useQuery({
    queryKey: [QUERY_KEYS.BOOKED_SLOTS, doctor?.id],
    queryFn: () => doctor && getBookedSlots(doctor.id, date.toISOString()),
  })
  const { data: availableSlots, refetch: refetchAvailableSlots } = useQuery({
    queryKey: [QUERY_KEYS.AVAILABLE_SLOTS, doctor?.id],
    queryFn: () => doctor && getAvailableSlots(doctor.id, date.toISOString()),
  })
  const { data: recurrenceRules, refetch: refetchRecurrenceRules } = useQuery({
    queryKey: [QUERY_KEYS.RECCURENCE_RULES, doctor?.id],
    queryFn: () => doctor && getReccurenceRules(doctor.id, date),
  })

  const { data: fetchedDoctors } = useQuery({
    queryKey: [QUERY_KEYS.DOCTORS],
    queryFn: () => getDoctors(),
    initialData: initialDoctors as Doctor[],
  })

  useEffect(() => {
    if (doctor) {
      refetchBookedSlots()
      refetchAvailableSlots()
      refetchRecurrenceRules()
    }
  }, [date])

  useEffect(() => {
    setBookedSlots(
      bookedSlots?.sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime()
      ) || []
    )
    const processedRecurrenceRules =
      recurrenceRules?.map((rule) => ({
        ...rule,
        startTime: new Date(
          date.setHours(rule.startTime.getHours(), rule.startTime.getMinutes())
        ),
        endTime: new Date(
          date.setHours(rule.endTime.getHours(), rule.endTime.getMinutes())
        ),
        endDate: rule.endDate ? new Date(rule.endDate) : null,
        recurrenceType: rule.recurrenceType || 'daily',
        weekdays: rule.weekdays || 0,
      })) || []

    const filteredRecurrenceRules = processedRecurrenceRules.filter((rule) => {
      if (!rule.endDate || rule.endDate.getTime() < new Date().getTime()) {
        return false
      }

      return !bookedSlots?.some((slot) =>
        doTimesOverlap(
          rule.startTime,
          rule.endTime,
          slot.startTime,
          slot.endTime
        )
      )
    })

    setRecurrenceRules(filteredRecurrenceRules)

    const combinedAvailableSlots = [
      ...(availableSlots?.map((slot) => ({
        ...slot,
        isRecurrence: false,
      })) || []),
      ...(filteredRecurrenceRules?.map((rule) => ({
        ...rule,
        isRecurrence: true,
        recurrenceRuleId: rule.id,
      })) || []),
    ] as (Slot & { isRecurrence: boolean })[]
    const sortedAvailableSlots = combinedAvailableSlots?.sort((a, b) => {
      const aTime =
        a.startTime instanceof Date ? a.startTime : new Date(a.startTime)
      const bTime =
        b.startTime instanceof Date ? b.startTime : new Date(b.startTime)
      return aTime.getTime() - bTime.getTime()
    })
    setAvailableSlots(sortedAvailableSlots || [])
  }, [bookedSlots, availableSlots, recurrenceRules, date])

  useEffect(() => {
    if (fetchedDoctors) {
      const doctorsWithDates = fetchedDoctors.map((doctor) => ({
        ...doctor,
        createdAt: new Date(doctor.createdAt),
        updatedAt: new Date(doctor.updatedAt),
      }))
      setDoctors(doctorsWithDates)
      if (!doctor) {
        setDoctor(doctorsWithDates[0])
      }
    }
  }, [fetchedDoctors])

  return children
}

function doTimesOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  return start1 < end2 && end1 > start2
}
