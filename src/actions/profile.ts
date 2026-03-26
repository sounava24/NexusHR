"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  const name = formData.get("name") as string
  const image = formData.get("image") as string // Base64 string

  if (!name) throw new Error("Name is required")

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      ...(image ? { image } : {}),
    },
  })

  // We need to revalidate the layouts or wherever the user is displayed
  revalidatePath("/dashboard", "layout")
  revalidatePath("/dashboard/profile")
}
