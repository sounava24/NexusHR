import { requireRole } from "@/lib/rbac"
import { prisma } from "@/lib/prisma"

export async function GET() {
  // 🔥 Only ADMIN & HR can access
  await requireRole(["ADMIN", "HR"])

  const employees = await prisma.employee.findMany({
    include: {
      user: true,
      department: true,
    },
  })

  return Response.json(employees)
}