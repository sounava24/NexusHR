"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createDepartment(formData: FormData) {
  const name = formData.get("name") as string

  if (!name) throw new Error("Missing name")

  await prisma.department.create({
    data: { name },
  })

  revalidatePath("/dashboard/departments")
}

export async function deleteDepartment(id: string) {
  // Check if department has employees
  const dept = await prisma.department.findUnique({
    where: { id },
    include: { _count: { select: { employees: true } } }
  })

  if (dept && dept._count.employees > 0) {
    throw new Error("Cannot delete department with active employees. Reassign them first.")
  }

  await prisma.department.delete({ where: { id } })
  revalidatePath("/dashboard/departments")
}
