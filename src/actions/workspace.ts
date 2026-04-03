"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { TaskStatus } from "@prisma/client"

export async function createTask(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const title = formData.get("title") as string
  if (!title) throw new Error("Title is required")

  const employee = await prisma.employee.findUnique({
    where: { userId: session.user.id }
  })

  if (!employee) throw new Error("Employee record not found")

  await prisma.task.create({
    data: {
      title,
      departmentId: employee.departmentId,
      status: "TODO"
    }
  })

  revalidatePath("/dashboard/workspace")
}

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.task.update({
    where: { id: taskId },
    data: { status }
  })

  revalidatePath("/dashboard/workspace")
}

export async function assignTask(taskId: string, assigneeId: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  await prisma.task.update({
    where: { id: taskId },
    data: { assignedToId: assigneeId }
  })

  revalidatePath("/dashboard/workspace")
}

export async function sendMessage(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const content = formData.get("content") as string
  if (!content) return

  const employee = await prisma.employee.findUnique({
    where: { userId: session.user.id }
  })

  if (!employee) throw new Error("Employee record not found")

  await prisma.message.create({
    data: {
      content,
      senderId: employee.id,
      departmentId: employee.departmentId
    }
  })

  revalidatePath("/dashboard/workspace")
}
