"use client"

import { useState } from "react"
import { generatePayroll } from "@/actions/payroll"
import { Wallet, X } from "lucide-react"

export default function GeneratePayrollDialog({ employees }: { employees: any[] }) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  const [base, setBase] = useState(0)
  const [bonus, setBonus] = useState(0)
  const [deductions, setDeductions] = useState(0)

  async function handleAction(formData: FormData) {
    setPending(true)
    try {
      await generatePayroll(formData)
      setOpen(false)
    } catch (e) {
      console.error(e)
    } finally {
      setPending(false)
    }
  }

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const emp = employees.find(em => em.id === e.target.value)
    if (emp) {
      setBase(emp.salary / 12) // Monthly base
    }
  }

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] active:scale-95"
      >
        <Wallet className="w-4 h-4" />
        <span>Run Payroll</span>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 min-h-screen">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-950/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-indigo-400" />
                Issue Payslip
              </h2>
              <button 
                onClick={() => setOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={handleAction} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">Select Employee</label>
                <select required name="employeeId" onChange={handleEmployeeChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 appearance-none">
                  <option value="" disabled selected>Choose a team member...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.user.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-300">Base Salary (USD)</label>
                  <input required type="number" step="0.01" name="baseSalary" value={base ? base.toFixed(2) : ""} onChange={(e) => setBase(parseFloat(e.target.value) || 0)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-300">Pay Date</label>
                  <input required type="date" name="payDate" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-300">Bonus</label>
                  <input type="number" step="0.01" name="bonus" value={bonus || ""} onChange={(e) => setBonus(parseFloat(e.target.value) || 0)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" placeholder="0.00" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-300">Deductions</label>
                  <input type="number" step="0.01" name="deductions" value={deductions || ""} onChange={(e) => setDeductions(parseFloat(e.target.value) || 0)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" placeholder="0.00" />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 mt-4 flex items-center justify-between">
                <span className="text-sm text-indigo-200">Calculated Net Salary</span>
                <span className="text-xl font-bold text-white">${(base + bonus - deductions).toFixed(2)}</span>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button disabled={pending} type="submit" className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                  {pending ? "Processing..." : "Generate Payslip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
