ALTER TABLE "services" ALTER COLUMN "service_type_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "type" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "port" integer;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "last_deployment" timestamp;