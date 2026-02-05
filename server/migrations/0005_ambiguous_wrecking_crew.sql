CREATE TABLE IF NOT EXISTS "features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"path" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"allowed_roles" text[] DEFAULT '{"ROOT","ADMIN"}' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "features_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subfeatures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"feature_id" uuid NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"path" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"allowed_roles" text[] DEFAULT '{"ROOT","ADMIN"}' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	CONSTRAINT "subfeatures_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "subfeatures" ADD CONSTRAINT "subfeatures_feature_id_features_id_fk" FOREIGN KEY ("feature_id") REFERENCES "public"."features"("id") ON DELETE cascade ON UPDATE no action;