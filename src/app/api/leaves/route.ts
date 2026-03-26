export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { requireRole } from "@/lib/rbac"

export async function POST(req: Request) {
  const session = await auth()

  if (!session) throw new Error("Unauthorized")

  const body = await req.json()

  const employee = await prisma.employee.findUnique({
    where: { userId: session.user.id },
  })

  const leave = await prisma.leave.create({
    data: {
      employeeId: employee!.id,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      reason: body.reason,
    },
  })

  return Response.json(leave)
}
export async function PUT(req: Request) {
  await requireRole(["ADMIN", "HR"])

  const { id, status } = await req.json()

  const leave = await prisma.leave.update({
    where: { id },
    data: { status },
  })

  return Response.json(leave)
}
