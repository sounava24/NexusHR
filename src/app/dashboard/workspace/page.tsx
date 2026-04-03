import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Briefcase } from "lucide-react"

import { TaskBoard } from "@/components/dashboard/workspace/task-board"
import { TeamChat } from "@/components/dashboard/workspace/team-chat"

export const dynamic = "force-dynamic"

export default async function WorkspacePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const employee = await prisma.employee.findUnique({
    where: { userId: session.user.id },
    include: { department: true }
  })

  if (!employee) {
    return (
      <div className="p-8 text-white">
        <h1 className="text-2xl font-bold">Workspace Unavailable</h1>
        <p className="text-zinc-400 mt-2">You need to be assigned to an Employee profile to access workspaces.</p>
      </div>
    )
  }

  const tasks = await prisma.task.findMany({
    where: { departmentId: employee.departmentId },
    include: { assignee: { include: { user: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" }
  })

  // Fetch messages for the department
  const messages = await prisma.message.findMany({
    where: { departmentId: employee.departmentId },
    include: { sender: { include: { user: { select: { name: true } } } } },
    orderBy: { createdAt: "asc" }
  })

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-indigo-400" />
          {employee.department.name} Workspace
        </h1>
        <p className="text-zinc-400 mt-2">
          Collaborate on tasks and chat with your team members in the {employee.department.name} department.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left column: Tasks (takes 2/3 width on large screens) */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <TaskBoard tasks={tasks} />
        </div>

        {/* Right column: Chat (takes 1/3 width on large screens) */}
        <div className="flex flex-col min-h-0">
          <TeamChat messages={messages} currentUserId={employee.id} />
        </div>
      </div>
    </div>
  )
}
