import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { Clock, Clock4, CalendarCheck, CalendarOff } from "lucide-react"
import { clockIn, clockOut } from "@/actions/attendance"
import AttendanceCalendar from "@/components/dashboard/attendance-calendar"

export const dynamic = "force-dynamic"

export default async function AttendancePage() {
  const session = await auth()
  const employee = await prisma.employee.findUnique({
    where: { userId: session?.user?.id }
  })

  let isClockedIn = false
  let isClockedOut = false
  let myLogs: any[] = []
  let history: any[] = []

  if (employee) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    myLogs = await prisma.attendance.findMany({
      where: { employeeId: employee.id },
      orderBy: { date: "desc" },
      take: 100
    })

    const todayRecord = myLogs.find((r: any) => new Date(r.date).getTime() >= today.getTime())

    if (todayRecord) {
      isClockedIn = true
      if (todayRecord.clockOut) {
        isClockedOut = true
      }
    }
  }

  if (session?.user?.role === "ADMIN" || session?.user?.role === "HR") {
    // Admins see everyone's attendance in the lower table
    history = await prisma.attendance.findMany({
      orderBy: { date: "desc" },
      include: { employee: { include: { user: true } } },
      take: 100
    })
  } else {
    history = myLogs
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Time & Attendance</h1>
        <p className="text-zinc-400 mt-1">Track your daily work hours and view attendance history.</p>
      </div>

      {/* Clock In/Out Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <form action={clockIn} className="flex flex-col">
          <button 
            disabled={isClockedIn || !employee}
            className={`p-8 rounded-3xl border flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
              isClockedIn 
                ? "bg-zinc-950/50 border-white/5 opacity-50 cursor-not-allowed" 
                : "bg-indigo-600/10 border-indigo-500/20 hover:bg-indigo-600/20 hover:border-indigo-500/40 hover:-translate-y-1 shadow-[0_0_30px_rgba(79,70,229,0.1)] hover:shadow-[0_0_40px_rgba(79,70,229,0.2)]"
            }`}
          >
            <div className={`p-4 rounded-full ${isClockedIn ? "bg-zinc-900" : "bg-indigo-500/20 text-indigo-400"}`}>
              <Clock className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-1">Clock In</h3>
              <p className="text-zinc-400 text-sm max-w-[200px]">Record your start time for the day</p>
            </div>
          </button>
        </form>

        <form action={clockOut} className="flex flex-col">
          <button 
            disabled={!isClockedIn || isClockedOut || !employee}
            className={`p-8 rounded-3xl border flex flex-col items-center justify-center gap-4 transition-all duration-300 ${
              !isClockedIn || isClockedOut
                ? "bg-zinc-950/50 border-white/5 opacity-50 cursor-not-allowed" 
                : "bg-orange-600/10 border-orange-500/20 hover:bg-orange-600/20 hover:border-orange-500/40 hover:-translate-y-1 shadow-[0_0_30px_rgba(234,88,12,0.1)] hover:shadow-[0_0_40px_rgba(234,88,12,0.2)]"
            }`}
          >
            <div className={`p-4 rounded-full ${(!isClockedIn || isClockedOut) ? "bg-zinc-900" : "bg-orange-500/20 text-orange-400"}`}>
              <Clock4 className="w-8 h-8" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-white mb-1">Clock Out</h3>
              <p className="text-zinc-400 text-sm max-w-[200px]">Record your end time for the day</p>
            </div>
          </button>
        </form>
      </div>

      <AttendanceCalendar logs={myLogs} />

      <div className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-xl mt-8">
        <div className="p-6 border-b border-white/10 bg-zinc-900/50">
          <h2 className="text-lg font-semibold text-white">Recent Logs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-950 text-zinc-400 border-b border-white/10">
              <tr>
                {(session?.user?.role === "ADMIN" || session?.user?.role === "HR") && (
                  <th className="px-6 py-4 font-semibold">Employee</th>
                )}
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Clock In</th>
                <th className="px-6 py-4 font-semibold text-right">Clock Out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {history.map((record: any) => (
                <tr key={record.id} className="hover:bg-zinc-900/30 transition-colors">
                  {(session?.user?.role === "ADMIN" || session?.user?.role === "HR") && (
                    <td className="px-6 py-4 text-white font-medium">
                      {record.employee?.user?.name || "Unknown"}
                    </td>
                  )}
                  <td className="px-6 py-4 text-zinc-300">
                    {record.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      record.status === 'PRESENT' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {record.status === 'PRESENT' ? <CalendarCheck className="w-3.5 h-3.5" /> : <CalendarOff className="w-3.5 h-3.5" />}
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-zinc-300 font-mono">
                    {record.clockIn ? record.clockIn.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                  </td>
                  <td className="px-6 py-4 text-right text-zinc-300 font-mono">
                    {record.clockOut ? record.clockOut.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                  </td>
                </tr>
              ))}
              
              {history.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No attendance records found.
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
