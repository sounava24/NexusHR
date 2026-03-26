export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST() {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  const employee = await prisma.employee.findUnique({
    where: { userId: session.user.id },
  })

  const today = new Date()

  const attendance = await prisma.attendance.create({
    data: {
      employeeId: employee!.id,
      date: today,
      status: "PRESENT",
      clockIn: today,
    },
  })

  return Response.json(attendance)
}
export async function PUT(req: Request) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  const employee = await prisma.employee.findUnique({
    where: { userId: session.user.id },
  })

  const today = new Date()

  const record = await prisma.attendance.findFirst({
    where: {
      employeeId: employee!.id,
    },
    orderBy: { createdAt: "desc" },
  })

  const updated = await prisma.attendance.update({
    where: { id: record!.id },
    data: {
      clockOut: today,
    },
  })

  return Response.json(updated)
}
