"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { LeaveStatus } from "@prisma/client"

export async function requestLeave(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const employee = await prisma.employee.findUnique({
    where: { userId: session.user.id }
  })
  if (!employee) throw new Error("Employee record not found")

  const startDate = new Date(formData.get("startDate") as string)
  const endDate = new Date(formData.get("endDate") as string)
  const reason = formData.get("reason") as string

  if (!startDate || !endDate || !reason) {
    throw new Error("Missing required fields")
  }

  await prisma.leave.create({
    data: {
      employeeId: employee.id,
      startDate,
      endDate,
      reason,
      status: "PENDING",
    }
  })

  revalidatePath("/dashboard/leaves")
}

export async function updateLeaveStatus(leaveId: string, status: LeaveStatus) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")
  
  // Only Admin or HR can approve leaves
  if (session.user.role !== "ADMIN" && session.user.role !== "HR") {
    throw new Error("Forbidden: Insufficient permissions")
  }

  await prisma.leave.update({
    where: { id: leaveId },
    data: { status }
  })

  revalidatePath("/dashboard/leaves")
}
