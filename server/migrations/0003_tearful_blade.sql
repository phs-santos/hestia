-- ALTER TABLE "servers" ALTER COLUMN "host" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN "ip" text DEFAULT '127.0.0.1' NOT NULL;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN "status" text DEFAULT 'running';--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN "region" text;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN "cpu" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN "memory" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN "storage" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN "uptime" text DEFAULT '0d 0h 0m';