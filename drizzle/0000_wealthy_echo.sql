CREATE TABLE "automations" (
	"id" serial PRIMARY KEY NOT NULL,
	"device_id" text NOT NULL,
	"buffer_degrees" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
