import { auth } from "@/auth"

export async function requireRole(allowedRoles: string[]) {
  const session = await auth()

  if (!session || !allowedRoles.includes(session.user.role)) {
    throw new Error("Unauthorized")
  }

  return session
}