import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromCookies } from "@/lib/auth";

export async function POST(req: Request) {
  const userPayload = getUserFromCookies();
  if (!userPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    projectId,
    phaseId,
    testCaseId,
    title,
    severity,
    priority,
    description,
    stepsToReproduce,
    actualResult,
    expectedResult,
    status,
  } = body;

  if (!projectId || !phaseId || !title) {
    return NextResponse.json({ error: "Project, phase and title required" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.ownerId !== userPayload.userId) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const bug = await prisma.bugReport.create({
    data: {
      projectId,
      phaseId,
      testCaseId: testCaseId || null,
      title,
      severity: severity || "major",
      priority: priority || "medium",
      description: description || "",
      stepsToReproduce: stepsToReproduce || "",
      actualResult: actualResult || "",
      expectedResult: expectedResult || "",
      status: status || "new",
      detectedById: userPayload.userId,
    },
  });

  return NextResponse.json({ bug });
}
