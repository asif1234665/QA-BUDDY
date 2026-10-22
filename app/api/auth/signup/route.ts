import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { createToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const uniqueKey = `QA-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        uniqueKey,
        role: "tester",
      },
    });

    const token = createToken({ id: user.id, email: user.email });
    const response = NextResponse.json({
      message: "User created",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        uniqueKey: user.uniqueKey,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
