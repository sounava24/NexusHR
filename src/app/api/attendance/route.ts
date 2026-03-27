export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // ✅ IMPORTANT

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

// ✅ CLOCK IN
export async function POST() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const employee = await prisma.employee.findUnique({
      where: { userId: session.user.id },
    })

    if (!employee) {
      return Response.json({ error: "Employee not found" }, { status: 404 })
    }

    const today = new Date()

    const attendance = await prisma.attendance.create({
      data: {
        employeeId: employee.id,
        date: today,
        status: "PRESENT",
        clockIn: today,
      },
    })

    return Response.json(attendance)

  } catch (error) {
    console.error(error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}


// ✅ CLOCK OUT
export async function PUT() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const employee = await prisma.employee.findUnique({
      where: { userId: session.user.id },
    })

    if (!employee) {
      return Response.json({ error: "Employee not found" }, { status: 404 })
    }

    const record = await prisma.attendance.findFirst({
      where: { employeeId: employee.id },
      orderBy: { createdAt: "desc" },
    })

    if (!record) {
      return Response.json({ error: "No attendance record found" }, { status: 404 })
    }

    const updated = await prisma.attendance.update({
      where: { id: record.id },
      data: {
        clockOut: new Date(),
      },
    })

    return Response.json(updated)

  } catch (error) {
    console.error(error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}