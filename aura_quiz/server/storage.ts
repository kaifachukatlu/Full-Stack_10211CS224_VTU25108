import { type User, type InsertUser, users } from "@shared/schema";
import { getDb } from "./db";
import { eq } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class DrizzleStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const db = await getDb();
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = await getDb();
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const db = await getDb();
    await db.insert(users).values(insertUser);
    // For MySQL, get the inserted user by username since we can't use returning()
    const insertedUser = await db.select().from(users).where(eq(users.username, insertUser.username)).limit(1);
    return insertedUser[0];
  }
}

export const storage = new DrizzleStorage();
