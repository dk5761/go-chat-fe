CREATE TABLE `ChatList` (
	`user_id` text PRIMARY KEY NOT NULL,
	`last_message` text,
	`last_message_datetime` text,
	FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`last_message`) REFERENCES `Messages`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `Messages` (
	`id` text PRIMARY KEY NOT NULL,
	`event_type` text NOT NULL,
	`sender_id` text NOT NULL,
	`receiver_id` text NOT NULL,
	`content` text NOT NULL,
	`created_at` text NOT NULL,
	`file_url` text,
	FOREIGN KEY (`sender_id`) REFERENCES `Users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`receiver_id`) REFERENCES `Users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_messages_receiver_id` ON `Messages` (`receiver_id`);--> statement-breakpoint
CREATE TABLE `Users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`username` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text,
	`last_login` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Users_email_unique` ON `Users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `Users_username_unique` ON `Users` (`username`);--> statement-breakpoint
CREATE INDEX `idx_users_username` ON `Users` (`username`);--> statement-breakpoint
CREATE INDEX `idx_users_id` ON `Users` (`id`);