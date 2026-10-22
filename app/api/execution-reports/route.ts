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
    testPlanId,
    executionDate,
    summary,
    totalCases,
    passed,
    failed,
    blocked,
    resultStatus,
  } = body;

  if (!projectId || !phaseId || !testPlanId) {
    return NextResponse.json({ error: "Project, phase and test plan required" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.ownerId !== userPayload.userId) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const report = await prisma.executionReport.create({
    data: {
      projectId,
      phaseId,
      testPlanId,
      executedById: userPayload.userId,
      executionDate: new Date(executionDate || Date.now()),
      summary: summary || "",
      totalCases: Number(totalCases || 0),
      passed: Number(passed || 0),
      failed: Number(failed || 0),
      blocked: Number(blocked || 0),
      resultStatus: resultStatus || "in_progress",
    },
  });

  return NextResponse.json({ report });
}
