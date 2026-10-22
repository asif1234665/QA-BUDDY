import { NextResponse } from "next/server";
import { getUserFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const userPayload = getUserFromCookies();
  if (!userPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: userPayload.userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const userPayload = getUserFromCookies();
  if (!userPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, description } = await req.json();
  if (!name) {
    return NextResponse.json({ error: "Project name required" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name,
      description: description || "",
      ownerId: userPayload.userId,
      status: "active",
    },
  });

  return NextResponse.json({ project });
}
