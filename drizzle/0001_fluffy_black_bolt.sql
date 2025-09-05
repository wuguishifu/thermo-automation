ALTER TABLE "automations" ADD COLUMN "starts_at" time with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "automations" ADD COLUMN "ends_at" time with time zone NOT NULL;--> statement-breakpoint
ALTER TABLE "automations" ADD COLUMN "max_temperature" integer;--> statement-breakpoint
ALTER TABLE "automations" ADD COLUMN "min_temperature" integer;--> statement-breakpoint
ALTER TABLE "automations" ADD COLUMN "wraps" boolean DEFAULT false NOT NULL;