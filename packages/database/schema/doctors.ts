import { timestamp, pgTable, text } from 'drizzle-orm/pg-core'
import { createSelectSchema, createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { relations, sql } from 'drizzle-orm'
import { slots } from './slots'

export const doctors = pgTable('doctors', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text('username').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const doctorsRelations = relations(doctors, ({ many }) => ({
  slots: many(slots),
}))

export const selectDoctorSchema = createSelectSchema(doctors)
export const insertDoctorSchema = createInsertSchema(doctors)
export type Doctor = typeof doctors.$inferSelect

export const doctorFormSchema = selectDoctorSchema
  .pick({
    username: true,
    firstName: true,
    lastName: true,
    email: true,
  })
  .extend({
    username: z.string().min(3).max(20),
    firstName: z.string().min(3).max(20),
    lastName: z.string().min(3).max(20),
    email: z.string().email(),
  })

export type DoctorForm = z.infer<typeof doctorFormSchema>
