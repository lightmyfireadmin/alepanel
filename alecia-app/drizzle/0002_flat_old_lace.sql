CREATE INDEX "deals_year_idx" ON "deals" USING btree ("year");--> statement-breakpoint
CREATE INDEX "deals_sector_idx" ON "deals" USING btree ("sector");--> statement-breakpoint
CREATE INDEX "deals_region_idx" ON "deals" USING btree ("region");--> statement-breakpoint
CREATE INDEX "deals_mandate_type_idx" ON "deals" USING btree ("mandate_type");--> statement-breakpoint
CREATE INDEX "deals_year_display_order_idx" ON "deals" USING btree ("year","display_order");--> statement-breakpoint
CREATE INDEX "posts_is_published_idx" ON "posts" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "posts_published_at_idx" ON "posts" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category");--> statement-breakpoint
CREATE INDEX "posts_is_published_published_at_idx" ON "posts" USING btree ("is_published","published_at");