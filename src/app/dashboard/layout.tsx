import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/dashboard/sidebar"
import Topbar from "@/components/dashboard/topbar"
import { prisma } from "@/lib/prisma"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) redirect("/login")

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      employee: {
        include: { department: true }
      }
    }
  })

  // Lock out Google Login users who haven't completed onboarding setup
  if (dbUser?.employee?.department?.name === "Unassigned") {
    redirect("/onboarding")
  }

  const activeUser = { ...session.user, ...dbUser }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar role={activeUser.role || "EMPLOYEE"} />

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar user={activeUser} />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}