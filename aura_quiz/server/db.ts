import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "@shared/schema";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

let db: ReturnType<typeof drizzle> | null = null;

export const getDb = async () => {
  if (!db) {
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);
    db = drizzle(connection, { schema, mode: "default" });
  }
  return db;
};