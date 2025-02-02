import { timestamp, pgTable, text } from 'drizzle-orm/pg-core'
import { createSelectSchema, createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { doctors } from './doctors'
import { relations, sql } from 'drizzle-orm'
import { recurrenceRules } from './recurrence-rules'

export const slots = pgTable('slots', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  doctorId: text('doctor_id').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  status: text('status', { enum: ['available', 'booked'] })
    .default('available')
    .notNull(),
  recurrenceRuleId: text('recurrence_rule_id').references(
    () => recurrenceRules.id
  ),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const slotsRelations = relations(slots, ({ one }) => ({
  doctor: one(doctors, {
    fields: [slots.doctorId],
    references: [doctors.id],
  }),
}))

export const selectSlotSchema = createSelectSchema(slots)
export const insertSlotSchema = createInsertSchema(slots)

export type Slot = z.infer<typeof selectSlotSchema>
export type InsertSlot = z.infer<typeof insertSlotSchema>
export type SlotForm = Omit<InsertSlot, 'id' | 'createdAt' | 'updatedAt'>

export const slotRouteSchema = z.object({
  doctorId: z.string().min(1, 'Doctor is required'),
  startTime: z.number(),
  endTime: z.number(),
})

export const slotFormSchema = z.object({
  doctorId: z.string().min(1, 'Doctor is required'),
  startTime: z.date().refine((date) => date > new Date(), {
    message: 'Start time must be in the future',
  }),
  endTime: z.date().refine((date) => date > new Date(), {
    message: 'End time must be in the future',
  }),
})
