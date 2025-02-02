import { atom } from 'jotai'
import { Doctor } from '@doc/database/schema/doctors'

export const doctorsAtom = atom<Doctor[]>([])
export const doctorAtom = atom<Doctor | null>(null)
export const dateAtom = atom<Date | null>(null)
