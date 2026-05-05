import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getDb } from "./db";
import { quizzes, questions, quizResults } from "../shared/schema";
import { eq } from "drizzle-orm";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const db = await getDb();

  // Get all quizzes
  app.get("/api/quizzes", async (_req, res) => {
    try {
      const allQuizzes = await db.select().from(quizzes).execute();
      res.json(allQuizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ error: "Failed to fetch quizzes" });
    }
  });

  // Get quiz by ID with questions
  app.get("/api/quizzes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const quiz = await db
        .select()
        .from(quizzes)
        .where(eq(quizzes.id, id))
        .execute();

      if (!quiz.length) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      const quizQuestions = await db
        .select()
        .from(questions)
        .where(eq(questions.quizId, id))
        .execute();

      const questionsWithParsed = quizQuestions.map((q) => ({
        ...q,
        options: JSON.parse(q.options),
      }));

      res.json({
        ...quiz[0],
        questions: questionsWithParsed,
      });
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ error: "Failed to fetch quiz" });
    }
  });

  // Submit quiz answer
  app.post("/api/quizzes/:id/submit", async (req, res) => {
    try {
      const { id } = req.params;
      const { answers, userId } = req.body;

      const quizQuestions = await db
        .select()
        .from(questions)
        .where(eq(questions.quizId, id))
        .execute();

      let score = 0;
      quizQuestions.forEach((q, idx) => {
        if (answers[idx] === q.correctAnswer) {
          score++;
        }
      });

      const result = await db
        .insert(quizResults)
        .values({
          quizId: id,
          userId: userId || null,
          score,
          totalQuestions: quizQuestions.length,
        })
        .execute();

      const percentage = Math.round((score / quizQuestions.length) * 100);

      res.json({
        score,
        total: quizQuestions.length,
        percentage,
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      res.status(500).json({ error: "Failed to submit quiz" });
    }
  });

  // Seed data endpoint (for development)
  app.post("/api/seed", async (_req, res) => {
    try {
      const db = await getDb();

      // Clear existing data
      await db.delete(quizResults).execute();
      await db.delete(questions).execute();
      await db.delete(quizzes).execute();

      // Insert sample quizzes
      const quiz1 = await db
        .insert(quizzes)
        .values({
          title: "React Fundamentals",
          description: "Test your knowledge of React basics",
          category: "programming",
        })
        .execute();

      const quiz2 = await db
        .insert(quizzes)
        .values({
          title: "JavaScript ES6",
          description: "Learn ES6 features and modern JavaScript",
          category: "programming",
        })
        .execute();

      // Get the inserted quiz IDs
      const allQuizzes = await db.select().from(quizzes).execute();
      const q1 = allQuizzes[0];
      const q2 = allQuizzes[1];

      // Insert questions for React quiz
      await db
        .insert(questions)
        .values([
          {
            quizId: q1.id,
            question: "What is React?",
            options: JSON.stringify([
              "A JavaScript library for building user interfaces",
              "A Python framework",
              "A CSS preprocessor",
              "A database management system",
            ]),
            correctAnswer: 0,
          },
          {
            quizId: q1.id,
            question: "What does JSX stand for?",
            options: JSON.stringify([
              "JavaScript XML",
              "Java Syntax Extension",
              "JSON Extra",
              "JavaScript Express",
            ]),
            correctAnswer: 0,
          },
          {
            quizId: q1.id,
            question: "What is a React component?",
            options: JSON.stringify([
              "A reusable piece of UI",
              "A type of database",
              "A CSS file",
              "A JavaScript variable",
            ]),
            correctAnswer: 0,
          },
        ])
        .execute();

      // Insert questions for JavaScript quiz
      await db
        .insert(questions)
        .values([
          {
            quizId: q2.id,
            question: "What is an arrow function?",
            options: JSON.stringify([
              "A concise way to write functions in ES6",
              "A type of loop",
              "A CSS property",
              "A React hook",
            ]),
            correctAnswer: 0,
          },
          {
            quizId: q2.id,
            question: "What does 'const' do?",
            options: JSON.stringify([
              "Declares a constant variable",
              "Declares a variable that can be reassigned",
              "Creates a function",
              "Creates a class",
            ]),
            correctAnswer: 0,
          },
          {
            quizId: q2.id,
            question: "What is destructuring?",
            options: JSON.stringify([
              "Breaking down an object or array into individual variables",
              "Deleting an object",
              "Creating a new object",
              "A type of loop",
            ]),
            correctAnswer: 0,
          },
        ])
        .execute();

      res.json({ message: "Database seeded successfully" });
    } catch (error) {
      console.error("Error seeding database:", error);
      res.status(500).json({ error: "Failed to seed database" });
    }
  });

  return httpServer;
}
