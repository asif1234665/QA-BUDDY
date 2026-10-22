import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export function createToken(user: { id: string; email: string }) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "7d" }
  );
}

export function getUserFromCookies() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET || "dev-secret") as {
      userId: string;
      email: string;
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const userPayload = getUserFromCookies();
  if (!userPayload) return null;

  return await prisma.user.findUnique({ where: { id: userPayload.userId } });
}
