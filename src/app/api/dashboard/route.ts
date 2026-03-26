export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/rbac"

export async function GET() {
  await requireRole(["ADMIN", "HR"])

  const totalEmployees = await prisma.employee.count()

  const pendingLeaves = await prisma.leave.count({
    where: { status: "PENDING" },
  })

  const payrolls = await prisma.payroll.findMany()

  return Response.json({
    totalEmployees,
    pendingLeaves,
    payrolls,
  })
}
