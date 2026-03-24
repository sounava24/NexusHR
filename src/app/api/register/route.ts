import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  const body = await req.json()

  const { name, email, password, role } = body

  // 🔐 hash password here
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role, // ADMIN / HR / EMPLOYEE
    },
  })

  return Response.json(user)
}