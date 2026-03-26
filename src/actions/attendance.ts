"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function clockIn() {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const employee = await prisma.employee.findUnique({
    where: { userId: session.user.id }
  })
  if (!employee) throw new Error("Employee record not found")

  // Check if already clocked in today
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const existing = await prisma.attendance.findFirst({
    where: {
      employeeId: employee.id,
      date: { gte: today }
    }
  })

  if (existing) {
    throw new Error("Already checked in today")
  }

  await prisma.attendance.create({
    data: {
      employeeId: employee.id,
      date: new Date(),
      status: "PRESENT",
      clockIn: new Date(),
    }
  })

  revalidatePath("/dashboard/attendance")
}

export async function clockOut() {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const employee = await prisma.employee.findUnique({
    where: { userId: session.user.id }
  })
  if (!employee) throw new Error("Employee record not found")

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const existing = await prisma.attendance.findFirst({
    where: {
      employeeId: employee.id,
      date: { gte: today }
    }
  })

  if (!existing || existing.clockOut) {
    throw new Error("Cannot clock out")
  }

  await prisma.attendance.update({
    where: { id: existing.id },
    data: { clockOut: new Date() }
  })

  revalidatePath("/dashboard/attendance")
}
