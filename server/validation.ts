// Validation utilities for user input

export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

// Email regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Username validation
export function validateUsername(username: string): string | null {
  if (!username || username.trim().length === 0) {
    return "Username is required";
  }

  if (username.length < 3) {
    return "Username must be at least 3 characters long";
  }

  if (username.length > 20) {
    return "Username must be less than 20 characters";
  }

  // Allow alphanumeric, underscores, and hyphens
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return "Username can only contain letters, numbers, underscores, and hyphens";
  }

  return null;
}

// Email validation
export function validateEmail(email: string): string | null {
  if (!email || email.trim().length === 0) {
    return "Email is required";
  }

  if (!EMAIL_REGEX.test(email)) {
    return "Please enter a valid email address";
  }

  if (email.length > 100) {
    return "Email is too long";
  }

  return null;
}

// Password validation
export function validatePassword(password: string): string | null {
  if (!password || password.length === 0) {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }

  if (password.length > 100) {
    return "Password is too long";
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return "Password must contain at least one number";
  }

  // Check for at least one letter
  if (!/[a-zA-Z]/.test(password)) {
    return "Password must contain at least one letter";
  }

  return null;
}

// Validate signup form
export function validateSignupForm(
  username: string,
  email: string,
  password: string
): ValidationResult {
  const errors: { [key: string]: string } = {};

  const usernameError = validateUsername(username);
  if (usernameError) {
    errors.username = usernameError;
  }

  const emailError = validateEmail(email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Validate login form
export function validateLoginForm(
  username: string,
  password: string
): ValidationResult {
  const errors: { [key: string]: string } = {};

  if (!username || username.trim().length === 0) {
    errors.username = "Username is required";
  }

  if (!password || password.length === 0) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Sanitize input (basic XSS prevention)
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}