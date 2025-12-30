CREATE INDEX "forum_posts_thread_id_idx" ON "forum_posts" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "forum_posts_author_id_idx" ON "forum_posts" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "forum_threads_category_id_idx" ON "forum_threads" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "forum_threads_author_id_idx" ON "forum_threads" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "kanban_boards_owner_id_idx" ON "kanban_boards" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "kanban_columns_board_id_idx" ON "kanban_columns" USING btree ("board_id");