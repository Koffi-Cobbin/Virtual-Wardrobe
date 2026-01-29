import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============================================================================
// PostgreSQL Schema (Drizzle ORM)
// Use this when you migrate from JSON database to PostgreSQL
// ============================================================================

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Drizzle insert schema with validation
export const insertUserSchema = createInsertSchema(users, {
  username: z.string().min(3).max(20),
  email: z.string().email().max(100),
  password: z.string().min(8).max(100),
}).pick({
  username: true,
  email: true,
  password: true,
});

// Drizzle TypeScript types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// ============================================================================
// JSON Database Types (Current Implementation)
// Used by server/db.ts for file-based storage
// ============================================================================

export interface UserJSON {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

// User without password (for API responses)
export interface UserPublic {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsertUserJSON {
  username: string;
  email: string;
  password: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  general?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: UserPublic;
  errors?: ValidationErrors;
}

export interface AuthSuccessResponse {
  success: true;
  message: string;
  user: UserPublic;
}

export interface AuthErrorResponse {
  success: false;
  message?: string;
  errors?: ValidationErrors;
}

// ============================================================================
// Request Types
// ============================================================================

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface PasswordResetRequest {
  email: string;
}