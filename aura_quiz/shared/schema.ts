import { sql } from "drizzle-orm";
import { mysqlTable, text, varchar, int, timestamp, json } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
});

export const quizzes = mysqlTable("quizzes", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).default("general"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const questions = mysqlTable("questions", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  quizId: varchar("quiz_id", { length: 36 }).notNull(),
  question: text("question").notNull(),
  options: text("options").notNull(), // JSON string of options
  correctAnswer: int("correct_answer").notNull(), // index of correct option
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const quizResults = mysqlTable("quiz_results", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`(UUID())`),
  quizId: varchar("quiz_id", { length: 36 }).notNull(),
  userId: varchar("user_id", { length: 36 }),
  score: int("score").notNull(),
  totalQuestions: int("total_questions").notNull(),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type QuizResult = typeof quizResults.$inferSelect;
