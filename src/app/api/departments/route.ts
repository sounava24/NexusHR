export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/rbac"

export async function POST(req: Request) {
  await requireRole(["ADMIN", "HR"])

  const { name } = await req.json()

  const dept = await prisma.department.create({
    data: { name },
  })

  return Response.json(dept)
}

export async function GET() {
  await requireRole(["ADMIN", "HR"])

  const departments = await prisma.department.findMany({
    include: {
      employees: true,
    },
  })

  return Response.json(departments)
}

