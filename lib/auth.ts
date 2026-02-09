import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "finanalyst-secret-change-in-production"
);

const COOKIE_NAME = "finanalyst-session";

export interface User {
  id: string;
  username: string;
  name: string;
}

interface StoredUser extends User {
  passwordHash: string;
}

// Demo users — in production, replace with a database
const USERS: StoredUser[] = [
  {
    id: "1",
    username: "admin",
    name: "Admin User",
    passwordHash: bcrypt.hashSync("admin123", 10),
  },
  {
    id: "2",
    username: "analyst",
    name: "Financial Analyst",
    passwordHash: bcrypt.hashSync("analyst123", 10),
  },
];

export async function authenticateUser(
  username: string,
  password: string
): Promise<User | null> {
  const user = USERS.find((u) => u.username === username);
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return null;
  return { id: user.id, username: user.username, name: user.name };
}

export async function createSession(user: User): Promise<string> {
  const token = await new SignJWT({ sub: user.id, username: user.username, name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
  return token;
}

export async function verifySession(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.sub as string,
      username: payload.username as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export { COOKIE_NAME };
