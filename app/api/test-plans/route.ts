import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromCookies } from "@/lib/auth";

export async function POST(req: Request) {
  const userPayload = getUserFromCookies();
  if (!userPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, phaseId, title, objective, scope, environment } = await req.json();
  if (!projectId || !phaseId || !title) {
    return NextResponse.json({ error: "Project, phase and title required" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.ownerId !== userPayload.userId) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const plan = await prisma.testPlan.create({
    data: {
      projectId,
      phaseId,
      title,
      objective: objective || "",
      scope: scope || "",
      environment: environment || "",
      createdById: userPayload.userId,
    },
  });

  return NextResponse.json({ plan });
}
