ALTER TABLE `Messages` ADD `delivered` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `Messages` ADD `delivered_at` text;--> statement-breakpoint
ALTER TABLE `Messages` ADD `status` text;