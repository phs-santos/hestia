ALTER TABLE "services" ALTER COLUMN "service_type_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "type" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "port" integer;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "last_deployment" timestamp;