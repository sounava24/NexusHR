import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ShieldAlert } from "lucide-react"
import { UserRoleTable } from "@/components/dashboard/user-role-table"

export const dynamic = "force-dynamic"

export default async function AdminUsersPage() {
  const session = await auth()

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const users = await prisma.user.findMany({
    include: {
      employee: {
        include: {
          department: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-red-400" />
          Access Control
        </h1>
        <p className="text-zinc-400 mt-2">Manage system roles and permissions across your organization.</p>
      </div>

      <UserRoleTable users={users} />
    </div>
  )
}
