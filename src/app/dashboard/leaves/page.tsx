import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import RequestLeaveDialog from "@/components/dashboard/request-leave"
import LeaveActionButtons from "@/components/dashboard/leave-actions"
import { CalendarRange, CheckCircle2, Clock, XCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function LeavesPage() {
  const session = await auth()
  const role = session?.user?.role

  const employee = await prisma.employee.findUnique({
    where: { userId: session?.user?.id }
  })

  // Admins see all leaves, employees see their own
  const leaves = await prisma.leave.findMany({
    where: role === "ADMIN" || role === "HR" ? {} : { employeeId: employee?.id },
    include: { employee: { include: { user: true } } },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Leave Requests</h1>
          <p className="text-zinc-400 mt-1">
            {role === "ADMIN" || role === "HR" ? "Manage and review employee time off requests." : "View your time off history and request new leaves."}
          </p>
        </div>
        <RequestLeaveDialog />
      </div>

      <div className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-900/50 text-zinc-400 border-b border-white/10">
              <tr>
                {(role === "ADMIN" || role === "HR") && (
                  <th className="px-6 py-4 font-semibold">Employee</th>
                )}
                <th className="px-6 py-4 font-semibold">Date Range</th>
                <th className="px-6 py-4 font-semibold w-1/3">Reason</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                {(role === "ADMIN" || role === "HR") && (
                  <th className="px-6 py-4"></th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-zinc-900/30 transition-colors group">
                  {(role === "ADMIN" || role === "HR") && (
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{leave.employee.user.name}</div>
                      <div className="text-xs text-zinc-500">{leave.employee.designation}</div>
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <CalendarRange className="w-4 h-4 text-zinc-500" />
                      <span>{leave.startDate.toLocaleDateString()} &mdash; {leave.endDate.toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-zinc-400 truncate max-w-xs" title={leave.reason}>
                      {leave.reason}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      leave.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      leave.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {leave.status === 'APPROVED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {leave.status === 'REJECTED' && <XCircle className="w-3.5 h-3.5" />}
                      {leave.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                      {leave.status}
                    </span>
                  </td>
                  {(role === "ADMIN" || role === "HR") && (
                    <td className="px-6 py-4 min-w-[100px]">
                      {leave.status === "PENDING" && (
                        <LeaveActionButtons leaveId={leave.id} />
                      )}
                    </td>
                  )}
                </tr>
              ))}

              {leaves.length === 0 && (
                <tr>
                  <td colSpan={role === "ADMIN" || role === "HR" ? 5 : 4} className="px-6 py-12 text-center text-zinc-500">
                    No leave requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
