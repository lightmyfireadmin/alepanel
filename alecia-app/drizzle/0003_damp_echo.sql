ALTER TABLE "documents" ALTER COLUMN "url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "content" jsonb;