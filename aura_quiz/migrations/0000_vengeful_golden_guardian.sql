CREATE TABLE `questions` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`quiz_id` varchar(36) NOT NULL,
	`question` text NOT NULL,
	`options` text NOT NULL,
	`correct_answer` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_results` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`quiz_id` varchar(36) NOT NULL,
	`user_id` varchar(36),
	`score` int NOT NULL,
	`total_questions` int NOT NULL,
	`completed_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quizzes` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`title` varchar(255) NOT NULL,
	`description` text,
	`category` varchar(100) DEFAULT 'general',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quizzes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL DEFAULT (UUID()),
	`username` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`)
);
