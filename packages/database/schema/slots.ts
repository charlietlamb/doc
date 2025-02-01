import { timestamp, pgTable, text } from 'drizzle-orm/pg-core'
import { createSelectSchema, createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { doctors } from './doctors'
import { relations } from 'drizzle-orm'

export const slots = pgTable('slots', {
  id: text('id').primaryKey(),
  doctorId: text('doctor_id')
    .notNull()
    .references(() => doctors.id),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  status: text('status', { enum: ['available', 'booked'] })
    .notNull()
    .default('available'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const slotsRelations = relations(slots, ({ one }) => ({
  doctor: one(doctors, {
    fields: [slots.doctorId],
    references: [doctors.id],
  }),
}))

export const selectSlotSchema = createSelectSchema(slots)
export const insertSlotSchema = createInsertSchema(slots)
export type Slot = typeof slots.$inferSelect

export const slotFormSchema = selectSlotSchema.pick({
  doctorId: true,
  startTime: true,
  endTime: true,
})

export type SlotForm = z.infer<typeof slotFormSchema>
