import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import GeneratePayrollDialog from "@/components/dashboard/generate-payroll"
import { Wallet, Briefcase, FileText } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function PayrollPage() {
  const session = await auth()
  const role = session?.user?.role

  const reqEmployee = await prisma.employee.findUnique({
    where: { userId: session?.user?.id }
  })

  // Admins see all payrolls, employees see their own
  const payrolls = await prisma.payroll.findMany({
    where: role === "ADMIN" || role === "HR" ? {} : { employeeId: reqEmployee?.id },
    include: { employee: { include: { user: true, department: true } } },
    orderBy: { payDate: "desc" }
  })

  const allEmployees = (role === "ADMIN" || role === "HR") 
    ? await prisma.employee.findMany({ include: { user: true } }) 
    : []

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Payroll & Compensation</h1>
          <p className="text-zinc-400 mt-1">
            {role === "ADMIN" || role === "HR" ? "Generate payslips and manage employee salaries." : "Review your compensation history and payslips."}
          </p>
        </div>
        {(role === "ADMIN" || role === "HR") && (
          <GeneratePayrollDialog employees={allEmployees} />
        )}
      </div>

      <div className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-900/50 text-zinc-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Pay Date / Ref</th>
                {(role === "ADMIN" || role === "HR") && (
                  <th className="px-6 py-4 font-semibold">Employee</th>
                )}
                <th className="px-6 py-4 font-semibold text-right">Base Salary</th>
                <th className="px-6 py-4 font-semibold text-right">Adjustments</th>
                <th className="px-6 py-4 font-semibold text-right">Net Compensation</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payrolls.map((payroll: any) => {
                const isBonus = payroll.bonus > 0;
                const isDeduct = payroll.deductions > 0;

                return (
                  <tr key={payroll.id} className="hover:bg-zinc-900/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          <Wallet className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{payroll.payDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                          <div className="text-xs text-zinc-500 font-mono">#{payroll.id.slice(-8).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    {(role === "ADMIN" || role === "HR") && (
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{payroll.employee.user.name}</div>
                        <div className="text-xs text-zinc-500">{payroll.employee.department?.name || 'Unassigned'}</div>
                      </td>
                    )}
                    <td className="px-6 py-4 text-right">
                      <div className="font-medium text-zinc-300">${payroll.baseSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end gap-1">
                        {isBonus && <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">+{payroll.bonus.toFixed(2)} Bonus</span>}
                        {isDeduct && <span className="text-xs font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded">-{payroll.deductions.toFixed(2)} Ded</span>}
                        {!isBonus && !isDeduct && <span className="text-xs text-zinc-600">None</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="text-lg font-bold text-white">${payroll.netSalary.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-indigo-400 bg-indigo-600/10 border border-indigo-500/20 rounded-lg hover:bg-indigo-600/20 transition-all ml-auto opacity-0 group-hover:opacity-100">
                        <FileText className="w-3.5 h-3.5" />
                        Payslip
                      </button>
                    </td>
                  </tr>
                )
              })}

              {payrolls.length === 0 && (
                <tr>
                  <td colSpan={role === "ADMIN" || role === "HR" ? 6 : 5} className="px-6 py-12 text-center text-zinc-500">
                    No payroll records found.
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
