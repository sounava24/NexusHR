export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/rbac"

export async function POST(req: Request) {
  await requireRole(["ADMIN", "HR"])

  const body = await req.json()

  const netSalary =
    body.baseSalary + body.bonus - body.deductions

  const payroll = await prisma.payroll.create({
    data: {
      employeeId: body.employeeId,
      baseSalary: body.baseSalary,
      bonus: body.bonus,
      deductions: body.deductions,
      netSalary,
      payDate: new Date(),
    },
  })

  return Response.json(payroll)
}
