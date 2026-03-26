export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/lib/rbac"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  await requireRole(["ADMIN", "HR"])

  const body = await req.json()
  const { name, email, password, departmentId, designation, salary } = body

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "EMPLOYEE",
    },
  })

  const employee = await prisma.employee.create({
    data: {
      userId: user.id,
      departmentId,
      designation,
      salary,
    },
  })

  return Response.json({ user, employee })
}

export async function GET(req: Request) {
  await requireRole(["ADMIN", "HR"])

  const { searchParams } = new URL(req.url)
  const search = searchParams.get("search") || ""

  const employees = await prisma.employee.findMany({
    where: {
      user: {
        name: {
          contains: search,
        },
      },
    },
    include: {
      user: true,
      department: true,
    },
  })

  return Response.json(employees)
}
