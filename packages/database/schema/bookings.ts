import { timestamp, pgTable, text } from 'drizzle-orm/pg-core'
import { createSelectSchema, createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { slots } from './slots'
import { relations } from 'drizzle-orm'

export const bookings = pgTable('bookings', {
  id: text('id').primaryKey(),
  slotId: text('slot_id')
    .notNull()
    .references(() => slots.id),
  patientId: text('patient_id').notNull(),
  reason: text('reason').notNull(),
  bookingTime: timestamp('booking_time').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const bookingsRelations = relations(bookings, ({ one }) => ({
  slot: one(slots, {
    fields: [bookings.slotId],
    references: [slots.id],
  }),
}))

export const selectBookingSchema = createSelectSchema(bookings)
export const insertBookingSchema = createInsertSchema(bookings)
export type Booking = typeof bookings.$inferSelect

export const bookingFormSchema = selectBookingSchema.pick({
  slotId: true,
  patientId: true,
  reason: true,
})

export type BookingForm = z.infer<typeof bookingFormSchema>
