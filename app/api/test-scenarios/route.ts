import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromCookies } from "@/lib/auth";

export async function POST(req: Request) {
  const userPayload = getUserFromCookies();
  if (!userPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { projectId, phaseId, testPlanId, title, objective, preconditions, steps, expectedResult } = body;

  if (!projectId || !phaseId || !testPlanId || !title) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.ownerId !== userPayload.userId) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const scenario = await prisma.testScenario.create({
    data: {
      projectId,
      phaseId,
      testPlanId,
      title,
      objective: objective || "",
      preconditions: preconditions || "",
      steps: steps || "",
      expectedResult: expectedResult || "",
      createdById: userPayload.userId,
    },
  });

  return NextResponse.json({ scenario });
}
