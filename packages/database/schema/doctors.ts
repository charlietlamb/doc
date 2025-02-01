import { timestamp, pgTable, text } from 'drizzle-orm/pg-core'
import { createSelectSchema, createInsertSchema } from 'drizzle-zod'

export const doctors = pgTable('doctors', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const selectDoctorSchema = createSelectSchema(doctors)
export const insertDoctorSchema = createInsertSchema(doctors)
export type Doctor = typeof doctors.$inferSelect

export const doctorFormSchema = insertDoctorSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export type DoctorForm = typeof doctorFormSchema
