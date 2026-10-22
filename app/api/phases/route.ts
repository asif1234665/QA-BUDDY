import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromCookies } from "@/lib/auth";

export async function POST(req: Request) {
  const userPayload = getUserFromCookies();
  if (!userPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, name, description } = await req.json();
  if (!projectId || !name) {
    return NextResponse.json({ error: "Project and name required" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.ownerId !== userPayload.userId) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const phase = await prisma.phase.create({
    data: {
      projectId,
      name,
      description: description || "",
      status: "planned",
    },
  });

  return NextResponse.json({ phase });
}
