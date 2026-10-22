import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromCookies } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userPayload = getUserFromCookies();
  if (!userPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project || project.ownerId !== userPayload.userId) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const phases = await prisma.phase.findMany({ where: { projectId: params.id }, orderBy: { createdAt: "desc" } });
  const plans = await prisma.testPlan.findMany({ where: { projectId: params.id }, orderBy: { createdAt: "desc" } });
  const scenarios = await prisma.testScenario.findMany({ where: { projectId: params.id }, orderBy: { createdAt: "desc" } });
  const cases = await prisma.testCase.findMany({ where: { projectId: params.id }, orderBy: { createdAt: "desc" } });
  const bugs = await prisma.bugReport.findMany({ where: { projectId: params.id }, orderBy: { createdAt: "desc" } });
  const reports = await prisma.executionReport.findMany({ where: { projectId: params.id }, orderBy: { createdAt: "desc" } });

  return NextResponse.json({ project, phases, plans, scenarios, cases, bugs, reports });
}
