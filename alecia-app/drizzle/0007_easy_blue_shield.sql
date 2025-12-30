CREATE INDEX "chart_configs_user_id_idx" ON "chart_configs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "job_offers_is_published_display_order_idx" ON "job_offers" USING btree ("is_published","display_order");--> statement-breakpoint
CREATE INDEX "pads_owner_id_idx" ON "pads" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "projects_column_id_idx" ON "projects" USING btree ("column_id");--> statement-breakpoint
CREATE INDEX "research_tasks_created_by_idx" ON "research_tasks" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "sign_requests_requester_id_idx" ON "sign_requests" USING btree ("requester_id");--> statement-breakpoint
CREATE INDEX "sign_requests_status_idx" ON "sign_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "spreadsheets_owner_id_idx" ON "spreadsheets" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "whiteboards_owner_id_idx" ON "whiteboards" USING btree ("owner_id");