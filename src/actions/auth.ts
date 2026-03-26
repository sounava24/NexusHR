"use server"

import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { redirect } from "next/navigation"

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const designation = formData.get("designation") as string || "New Hire"

  if (!name || !email || !password) {
    throw new Error("Missing required fields")
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new Error("User already exists")
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  // Ensure "Unassigned" dept exists
  const defaultDept = await prisma.department.upsert({
    where: { name: "Unassigned" },
    update: {},
    create: { name: "Unassigned" },
  })

  // Count to see if first user, make them ADMIN
  const userCount = await prisma.user.count()
  const role = userCount === 0 ? "ADMIN" : "EMPLOYEE"

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      employee: {
        create: {
          departmentId: defaultDept.id,
          designation: userCount === 0 ? "System Admin" : designation,
          salary: 0,
        }
      }
    }
  })

  redirect("/login")
}
