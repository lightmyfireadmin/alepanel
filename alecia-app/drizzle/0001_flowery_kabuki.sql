CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"company" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'new',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "buyer_criteria_contact_id_idx" ON "buyer_criteria" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "contacts_company_id_idx" ON "contacts" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "documents_project_id_idx" ON "documents" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "project_events_project_id_idx" ON "project_events" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "projects_client_id_idx" ON "projects" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "sectors_referent_partner_id_idx" ON "sectors" USING btree ("referent_partner_id");--> statement-breakpoint
CREATE INDEX "testimonials_deal_id_idx" ON "testimonials" USING btree ("deal_id");--> statement-breakpoint
CREATE INDEX "voice_notes_project_id_idx" ON "voice_notes" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "voice_notes_contact_id_idx" ON "voice_notes" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "voice_notes_recorded_by_idx" ON "voice_notes" USING btree ("recorded_by");