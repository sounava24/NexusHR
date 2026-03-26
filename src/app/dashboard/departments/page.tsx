import { prisma } from "@/lib/prisma"
import AddDepartmentDialog from "@/components/dashboard/add-department"
import { Users, MoreHorizontal } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DepartmentsPage() {
  const departments = await prisma.department.findMany({
    include: {
      _count: {
        select: { employees: true }
      }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Departments</h1>
          <p className="text-zinc-400 mt-1">Manage global teams and organizational units.</p>
        </div>
        <AddDepartmentDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-zinc-950 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/50 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
            
            <div className="flex items-start justify-between mb-8 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
                <span className="text-xl font-bold text-indigo-400">{dept.name.charAt(0)}</span>
              </div>
              <button className="text-zinc-500 hover:text-white transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-1">{dept.name}</h3>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Users className="w-4 h-4" />
                <span>{dept._count.employees} team members</span>
              </div>
            </div>
          </div>
        ))}

        {departments.length === 0 && (
          <div className="col-span-full p-12 text-center border border-dashed border-white/10 rounded-2xl text-zinc-500">
            No departments found. Create your first organizational unit.
          </div>
        )}
      </div>
    </div>
  )
}
