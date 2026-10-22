import { NextResponse } from "next/server";
import { getUserFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const userPayload = getUserFromCookies();
  if (!userPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userPayload.userId },
    select: {
      id: true,
      name: true,
      email: true,
      uniqueKey: true,
      role: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ user });
}
