"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function generatePayroll(formData: FormData) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN" && session?.user?.role !== "HR") {
    throw new Error("Unauthorized")
  }

  const employeeId = formData.get("employeeId") as string
  const baseSalary = parseFloat(formData.get("baseSalary") as string)
  const bonus = parseFloat((formData.get("bonus") as string) || "0")
  const deductions = parseFloat((formData.get("deductions") as string) || "0")
  const payDateStr = formData.get("payDate") as string

  if (!employeeId || isNaN(baseSalary) || !payDateStr) {
    throw new Error("Missing required fields")
  }

  const payDate = new Date(payDateStr)
  const netSalary = baseSalary + bonus - deductions

  await prisma.payroll.create({
    data: {
      employeeId,
      baseSalary,
      bonus,
      deductions,
      netSalary,
      payDate,
    }
  })

  revalidatePath("/dashboard/payroll")
}
