"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { revalidatePath } from "next/cache"

export async function createEmployee(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const designation = formData.get("designation") as string
  const salary = parseFloat(formData.get("salary") as string)
  const departmentId = formData.get("departmentId") as string

  if (!name || !email || !password || !designation || !salary || !departmentId) {
    throw new Error("Missing required fields")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "EMPLOYEE",
      employee: {
        create: {
          departmentId,
          designation,
          salary,
        }
      }
    }
  })

  revalidatePath("/dashboard/employees")
}

export async function deleteEmployee(userId: string) {
  // Prisma handles cascading deletes if configured, but here we delete sequentially
  const employee = await prisma.employee.findUnique({ where: { userId } })
  if (employee) {
    await prisma.employee.delete({ where: { id: employee.id } })
  }
  await prisma.user.delete({ where: { id: userId } })
  revalidatePath("/dashboard/employees")
}

export async function fireEmployee(employeeId: string) {
  await prisma.employee.update({
    where: { id: employeeId },
    data: { status: "TERMINATED" }
  })
  revalidatePath("/dashboard/employees")
}

export async function promoteEmployee(formData: FormData) {
  const employeeId = formData.get("employeeId") as string
  const designation = formData.get("designation") as string
  const salary = parseFloat(formData.get("salary") as string)
  const departmentId = formData.get("departmentId") as string

  if (!employeeId || !designation || !salary || !departmentId) {
    throw new Error("Missing required fields for promotion")
  }

  await prisma.employee.update({
    where: { id: employeeId },
    data: {
      designation,
      salary,
      departmentId,
    }
  })

  revalidatePath("/dashboard/employees")
}
