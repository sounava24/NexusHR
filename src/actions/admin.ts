"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Role } from "@prisma/client"

export async function updateUserRole(userId: string, newRole: Role) {
  const session = await auth()
  
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only Admins can change roles")
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole }
  })

  revalidatePath("/dashboard/admin/users")
}
