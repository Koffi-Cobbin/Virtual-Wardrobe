import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import {
  createUser,
  authenticateUser,
  findUserByEmail,
  updateUserPassword,
  getUserById,
} from "./db";
import {
  validateSignupForm,
  validateLoginForm,
  validateEmail,
  sanitizeInput,
} from "./validation";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Signup endpoint
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Sanitize inputs
      const sanitizedUsername = sanitizeInput(username);
      const sanitizedEmail = sanitizeInput(email);

      // Validate form data
      const validation = validateSignupForm(
        sanitizedUsername,
        sanitizedEmail,
        password
      );

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors,
        });
      }

      // Create user
      const user = await createUser(sanitizedUsername, sanitizedEmail, password);

      // Return success (without password)
      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json({
        success: true,
        message: "Account created successfully",
        user: userWithoutPassword,
      });
    } catch (error) {
      // Handle specific errors
      if (error instanceof Error) {
        if (error.message === "Username already exists") {
          return res.status(409).json({
            success: false,
            errors: { username: "This username is already taken" },
          });
        }

        if (error.message === "Email already exists") {
          return res.status(409).json({
            success: false,
            errors: { email: "This email is already registered" },
          });
        }
      }

      // Generic error
      console.error("Signup error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred during signup. Please try again.",
      });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      // Sanitize inputs
      const sanitizedUsername = sanitizeInput(username);

      // Validate form data
      const validation = validateLoginForm(sanitizedUsername, password);

      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          errors: validation.errors,
        });
      }

      // Authenticate user
      const user = await authenticateUser(sanitizedUsername, password);

      if (!user) {
        return res.status(401).json({
          success: false,
          errors: {
            general: "Invalid username or password",
          },
        });
      }

      // Return success (without password)
      const { password: _, ...userWithoutPassword } = user;

      res.status(200).json({
        success: true,
        message: "Login successful",
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred during login. Please try again.",
      });
    }
  });

  // Password reset request endpoint
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { email } = req.body;

      // Sanitize input
      const sanitizedEmail = sanitizeInput(email);

      // Validate email
      const emailError = validateEmail(sanitizedEmail);
      if (emailError) {
        return res.status(400).json({
          success: false,
          errors: { email: emailError },
        });
      }

      // Check if user exists
      const user = await findUserByEmail(sanitizedEmail);

      // Always return success to prevent email enumeration
      // In a real app, you would send an email here
      res.status(200).json({
        success: true,
        message: "If an account exists with this email, a reset link has been sent.",
      });

      // Log for development purposes
      if (user) {
        console.log(`Password reset requested for user: ${user.username}`);
      }
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred. Please try again.",
      });
    }
  });

  // Get current user endpoint (if you implement sessions/tokens)
  app.get("/api/auth/me", async (req, res) => {
    try {
      // This would typically check for a session or JWT token
      // For now, we'll return a placeholder response
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred",
      });
    }
  });

  // Logout endpoint (placeholder for session management)
  app.post("/api/auth/logout", async (req, res) => {
    try {
      // This would typically clear session or invalidate token
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred",
      });
    }
  });

  // put other application routes here if needed
  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  return httpServer;
}