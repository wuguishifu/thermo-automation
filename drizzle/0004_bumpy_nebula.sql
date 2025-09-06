CREATE TABLE "device_status_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" text NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"max_temperature" real NOT NULL,
	"min_temperature" real NOT NULL,
	"current_temperature" real NOT NULL,
	"current_mode" integer NOT NULL,
	"humidity" real NOT NULL
);
--> statement-breakpoint
ALTER TABLE "automations" ALTER COLUMN "max_temperature" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "automations" ALTER COLUMN "min_temperature" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "automations" ALTER COLUMN "buffer_degrees" SET DATA TYPE real;