import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

const DB_PATH = path.join(process.cwd(), 'db', 'users.json');

export async function signupUser(formData: any) {
  const { username, email, password } = formData;

  if (!username || username.length < 3) {
    return { success: false, message: 'Username must be at least 3 characters' };
  }
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Valid email is required' };
  }
  if (!password || password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters' };
  }

  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    const users = JSON.parse(data);

    if (users.find((u: any) => u.username === username)) {
      return { success: false, message: 'Username already exists' };
    }
    if (users.find((u: any) => u.email === email)) {
      return { success: false, message: 'Email already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    users.push(newUser);
    fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));

    const { password: _, ...userWithoutPassword } = newUser;
    return {
      success: true,
      message: 'Account created successfully',
      user: userWithoutPassword,
    };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, message: 'Failed to save user' };
  }
}

export async function authenticateUser(username: string, password: string) {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    const users = JSON.parse(data);
    const user = users.find((u: any) => u.username === username);

    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

export async function findUserByEmail(email: string) {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    const users = JSON.parse(data);
    return users.find((u: any) => u.email === email);
  } catch (error) {
    return null;
  }
}
