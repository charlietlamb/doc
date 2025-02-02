CREATE TABLE "recurrence_rules" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"doctor_id" text NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"duration" text NOT NULL,
	"recurrence_type" text NOT NULL,
	"weekdays" jsonb,
	"end_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "slots" DROP CONSTRAINT "slots_doctor_id_doctors_id_fk";
--> statement-breakpoint
ALTER TABLE "slots" ADD COLUMN "recurrence_rule_id" text;--> statement-breakpoint
ALTER TABLE "slots" ADD CONSTRAINT "slots_recurrence_rule_id_recurrence_rules_id_fk" FOREIGN KEY ("recurrence_rule_id") REFERENCES "public"."recurrence_rules"("id") ON DELETE no action ON UPDATE no action;