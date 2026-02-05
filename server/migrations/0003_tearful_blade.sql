-- ALTER TABLE "servers" ALTER COLUMN "host" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN IF NOT EXISTS "ip" text DEFAULT '127.0.0.1' NOT NULL;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'running';--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN IF NOT EXISTS "region" text;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN IF NOT EXISTS "cpu" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN IF NOT EXISTS "memory" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN IF NOT EXISTS "storage" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN IF NOT EXISTS "uptime" text DEFAULT '0d 0h 0m';