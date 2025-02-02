export const WeekdayBits = {
  SUNDAY: 1,
  MONDAY: 2,
  TUESDAY: 4,
  WEDNESDAY: 8,
  THURSDAY: 16,
  FRIDAY: 32,
  SATURDAY: 64,
} as const

export type WeekdayNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6

const DateToWeekdayMap: { [K in WeekdayNumber]: number } = {
  0: WeekdayBits.SUNDAY,
  1: WeekdayBits.MONDAY,
  2: WeekdayBits.TUESDAY,
  3: WeekdayBits.WEDNESDAY,
  4: WeekdayBits.THURSDAY,
  5: WeekdayBits.FRIDAY,
  6: WeekdayBits.SATURDAY,
} as const

export function getWeekdayFromDate(date: Date): number {
  return DateToWeekdayMap[date.getDay() as WeekdayNumber]
}

export function getWeekdaysBetweenDates(
  startDate: Date,
  endDate: Date
): number {
  let weekdays = 0
  const currentDate = new Date(startDate)
  const endTime = endDate.getTime()

  while (currentDate.getTime() <= endTime) {
    weekdays = addWeekday(weekdays, currentDate.getDay() as WeekdayNumber)
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return weekdays
}

export function hasWeekday(weekdays: number, day: WeekdayNumber): boolean {
  return (weekdays & DateToWeekdayMap[day]) !== 0
}

export function addWeekday(weekdays: number, day: WeekdayNumber): number {
  return weekdays | DateToWeekdayMap[day]
}

export function removeWeekday(weekdays: number, day: WeekdayNumber): number {
  return weekdays & ~DateToWeekdayMap[day]
}
