import { atom } from 'jotai'
import { Doctor } from '@doc/database/schema/doctors'
import { Slot } from '@doc/database/schema'

export const doctorsAtom = atom<Doctor[]>([])
export const doctorAtom = atom<Doctor | null>(null)
export const dateAtom = atom<Date>(new Date())

export const availableSlotsAtom = atom<Slot[]>([])
export const bookedSlotsAtom = atom<Slot[]>([])
