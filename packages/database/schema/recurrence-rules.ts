import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { sql } from 'drizzle-orm'

export const recurrenceRules = pgTable('recurrence_rules', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  doctorId: text('doctor_id').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  recurrenceType: text('recurrence_type').notNull(),
  weekdays: integer('weekdays').notNull().default(0),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

const recurrenceRuleSchema = createSelectSchema(recurrenceRules)

export const insertRecurrenceRuleSchema = createInsertSchema(recurrenceRules)

export type RecurrenceRule = z.infer<typeof recurrenceRuleSchema>
export type InsertRecurrenceRule = z.infer<typeof insertRecurrenceRuleSchema>

export const recurrenceRouteSchema = z
  .object({
    doctorId: z.string().min(1, 'Doctor is required'),
    startTime: z.number(),
    endTime: z.number(),
    recurrenceType: z.enum(['daily', 'weekly']),
    weekdays: z.number().int().min(0).max(127).optional(),
    endDate: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    const startTime = new Date(data.startTime)
    const endTime = new Date(data.endTime)
    const durationMinutes =
      (endTime.getTime() - startTime.getTime()) / 1000 / 60

    if (durationMinutes <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End time must be after start time',
        path: ['endTime'],
      })
    }

    if (durationMinutes !== 15 && durationMinutes !== 30) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Time slot must be either 15 or 30 minutes',
        path: ['endTime'],
      })
    }
  })

export const recurrenceFormSchema = z
  .object({
    doctorId: z.string().min(1, 'Doctor is required'),
    startTime: z.date().refine((date) => date > new Date(), {
      message: 'Start time must be in the future',
    }),
    endTime: z.date().refine((date) => date > new Date(), {
      message: 'End time must be in the future',
    }),
    recurrenceType: z.enum(['daily', 'weekly']),
    weekdays: z.number().int().min(0).max(127).optional(),
    endDate: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    const durationMinutes =
      (data.endTime.getTime() - data.startTime.getTime()) / 1000 / 60

    if (durationMinutes <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End time must be after start time',
        path: ['endTime'],
      })
    }

    if (durationMinutes !== 15 && durationMinutes !== 30) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Time slot must be either 15 or 30 minutes',
        path: ['endTime'],
      })
    }

    if (data.endDate && data.endDate < data.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date must be after start time',
        path: ['endDate'],
      })
    }
  })

export type RecurrenceForm = z.infer<typeof recurrenceFormSchema>
