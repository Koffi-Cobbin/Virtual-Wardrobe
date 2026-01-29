import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import type { UserJSON, UserPublic, InsertUserJSON } from "../shared/schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, "..", "db", "users.json");

export interface UserDatabase {
  users: UserJSON[];
}

// Read database
export async function readDatabase(): Promise<UserDatabase> {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with empty users array
    const emptyDb: UserDatabase = { users: [] };
    await fs.writeFile(DB_PATH, JSON.stringify(emptyDb, null, 2));
    return emptyDb;
  }
}

// Write database
export async function writeDatabase(db: UserDatabase): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

// Generate unique ID
export function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Find user by username
export async function findUserByUsername(
  username: string
): Promise<UserJSON | undefined> {
  const db = await readDatabase();
  return db.users.find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );
}

// Find user by email
export async function findUserByEmail(email: string): Promise<UserJSON | undefined> {
  const db = await readDatabase();
  return db.users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
}

// Create user
export async function createUser(
  username: string,
  email: string,
  password: string
): Promise<UserJSON> {
  const db = await readDatabase();

  // Check if username already exists
  const existingUsername = await findUserByUsername(username);
  if (existingUsername) {
    throw new Error("Username already exists");
  }

  // Check if email already exists
  const existingEmail = await findUserByEmail(email);
  if (existingEmail) {
    throw new Error("Email already exists");
  }

  const hashedPassword = await hashPassword(password);
  const now = new Date().toISOString();

  const newUser: UserJSON = {
    id: generateId(),
    username,
    email,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  };

  db.users.push(newUser);
  await writeDatabase(db);

  return newUser;
}

// Authenticate user
export async function authenticateUser(
  username: string,
  password: string
): Promise<UserJSON | null> {
  const user = await findUserByUsername(username);

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    return null;
  }

  return user;
}

// Update user password
export async function updateUserPassword(
  email: string,
  newPassword: string
): Promise<boolean> {
  const db = await readDatabase();
  const userIndex = db.users.findIndex(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (userIndex === -1) {
    return false;
  }

  const hashedPassword = await hashPassword(newPassword);
  db.users[userIndex].password = hashedPassword;
  db.users[userIndex].updatedAt = new Date().toISOString();

  await writeDatabase(db);
  return true;
}

// Get user by ID (without password)
export async function getUserById(id: string): Promise<UserPublic | undefined> {
  const db = await readDatabase();
  const user = db.users.find((user) => user.id === id);

  if (!user) {
    return undefined;
  }

  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}