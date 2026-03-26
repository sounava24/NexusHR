import { prisma } from "@/lib/prisma"
import AddEmployeeDialog from "@/components/dashboard/add-employee"
import { MoreHorizontal, Mail, MapPin, Building2, Briefcase } from "lucide-react"
import { auth } from "@/auth"
import FireButton from "@/components/dashboard/fire-button"
import PromoteEmployeeDialog from "@/components/dashboard/promote-employee"

export const dynamic = "force-dynamic"

export default async function EmployeesPage() {
  const session = await auth()
  const isAdmin = session?.user?.role === "ADMIN"

  const employees = await prisma.employee.findMany({
    include: { user: true, department: true },
    orderBy: { createdAt: "desc" },
  })

  // We need to fetch departments for the Add user modal
  const departments = await prisma.department.findMany()

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Team Members</h1>
          <p className="text-zinc-400 mt-1">Manage employee profiles and organizational roles.</p>
        </div>
        {isAdmin && <AddEmployeeDialog departments={departments} />}
      </div>

      <div className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-900/50 text-zinc-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Employee</th>
                <th className="px-6 py-4 font-semibold">Contact Info</th>
                <th className="px-6 py-4 font-semibold">Role & Dept</th>
                <th className="px-6 py-4 font-semibold text-right">Compensation</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {employees.map((e: any) => (
                <tr key={e.id} className="hover:bg-zinc-900/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {e.user.image ? (
                        <img src={e.user.image} alt={e.user.name} className="w-10 h-10 rounded-full object-cover shadow-lg border border-white/10" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-lg">
                          {e.user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          {e.user.name}
                          {e.status === "TERMINATED" && <span className="text-[10px] uppercase font-bold text-red-400 border border-red-500/30 bg-red-500/10 px-1.5 rounded-full pb-[1px]">Fired</span>}
                        </div>
                        <div className="text-xs text-zinc-500">Joined {e.createdAt.toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Mail className="w-3.5 h-3.5 text-zinc-500" />
                      {e.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center gap-1.5 text-zinc-200 font-medium">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                        {e.designation}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Building2 className="w-3.5 h-3.5" />
                        {e.department?.name || "Unassigned"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-medium text-white">${e.salary.toLocaleString()}</div>
                    <div className="text-xs text-zinc-500">Per annum</div>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end h-full min-h-[72px] gap-2">
                    {isAdmin && e.status !== "TERMINATED" && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <PromoteEmployeeDialog employee={e} departments={departments} />
                        <FireButton employeeId={e.id} currentStatus={e.status || "ACTIVE"} />
                      </div>
                    )}
                    {isAdmin && e.status === "TERMINATED" && (
                      <FireButton employeeId={e.id} currentStatus={e.status || "ACTIVE"} />
                    )}
                  </td>
                </tr>
              ))}
              
              {employees.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No employees found. Add one to get started.
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