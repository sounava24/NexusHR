import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { Users, Building2, CalendarClock, Wallet, Clock } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const session = await auth()
  const role = session?.user?.role
  const name = session?.user?.name || "User"

  const employee = await prisma.employee.findUnique({
    where: { userId: session?.user?.id }
  })

  // Global Metrics
  const totalEmployees = await prisma.employee.count()
  const totalDepartments = await prisma.department.count()
  
  const today = new Date()
  today.setHours(0,0,0,0)
  const todayAttendance = await prisma.attendance.count({
    where: { date: { gte: today }, status: "PRESENT" }
  })
  const pendingLeaves = await prisma.leave.count({
    where: { status: "PENDING" }
  })

  // User Specific Metrics
  let userLeaves = 0
  if (employee) {
    userLeaves = await prisma.leave.count({
      where: { employeeId: employee.id, status: "APPROVED" }
    })
  }

  const statCards = [
    { title: "Total Employees", value: totalEmployees, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { title: "Departments", value: totalDepartments, icon: Building2, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { title: "Present Today", value: todayAttendance, icon: CalendarClock, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { title: "Pending Leaves", value: pendingLeaves, icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-950 border border-white/10 p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-600/20 to-violet-900/40 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Hello, {name}
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Welcome to the NexusHR dashboard. Let's make today productive and manage your workforce effectively.
          </p>
          <div className="mt-8 flex gap-4">
            <Link href="/dashboard/attendance" className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-95">
              Clock In / Out
            </Link>
            <Link href="/dashboard/leaves" className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 transition-all active:scale-95">
              Request Time Off
            </Link>
          </div>
        </div>
      </div>

      {/* Admin Stats Grid */}
      {(role === "ADMIN" || role === "HR") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-zinc-950 border border-white/10 overflow-hidden rounded-2xl p-6 relative group hover:border-white/20 transition-all">
              <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full blur-2xl -mr-8 -mt-8 transition-transform group-hover:scale-150`}></div>
              <div className="relative z-10 flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.border} border flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
                <p className="text-sm font-medium text-zinc-500 mt-1">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Employee Quick Access */}
      {(role === "EMPLOYEE") && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Approved Leaves</h3>
            <p className="text-4xl font-bold text-indigo-400">{userLeaves}</p>
          </div>
          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 flex flex-col justify-center items-center text-center">
            <Wallet className="w-8 h-8 text-emerald-400 mb-3" />
            <h3 className="text-lg font-semibold text-white">View Payslips</h3>
            <Link href="/dashboard/payroll" className="mt-2 text-sm text-indigo-400 hover:text-indigo-300">Open Payroll &rarr;</Link>
          </div>
        </div>
      )}
    </div>
  )
}