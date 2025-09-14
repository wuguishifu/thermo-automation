ALTER TABLE "device_status_records" ADD COLUMN "recorded_at_ms" bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "device_status_records" DROP COLUMN "recorded_at";