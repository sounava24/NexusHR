"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function completeOnboarding(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const departmentId = formData.get("departmentId") as string
  const designation = formData.get("designation") as string

  if (!departmentId || !designation) {
    throw new Error("Missing required fields")
  }

  // Update their employee record with the new department and designation
  await prisma.employee.update({
    where: { userId: session.user.id },
    data: {
      departmentId,
      designation
    }
  })

  // Clear caches
  revalidatePath("/dashboard")
  
  // Send them to the main dashboard
  redirect("/dashboard")
}
