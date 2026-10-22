import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/db";
import { getUserFromCookies } from "@/lib/auth";

export async function GET() {
  const userPayload = getUserFromCookies();
  if (!userPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const testCases = await prisma.testCase.findMany({
    where: { createdById: userPayload.userId },
    orderBy: { createdAt: "desc" },
  });

  const rows = testCases.map((item) => ({
    id: item.id,
    title: item.title,
    priority: item.priority,
    testType: item.testType,
    status: item.status,
    expectedResult: item.expectedResult,
    actualResult: item.actualResult,
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Test Cases");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=test-cases.xlsx",
    },
  });
}
