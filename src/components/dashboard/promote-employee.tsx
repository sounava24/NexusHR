"use client"

import { useState } from "react"
import { promoteEmployee } from "@/actions/employee"
import { ArrowUpCircle, X, Pencil } from "lucide-react"

export default function PromoteEmployeeDialog({ employee, departments }: { employee: any, departments: any[] }) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleAction(formData: FormData) {
    setPending(true)
    try {
      await promoteEmployee(formData)
      setOpen(false)
    } catch (e) {
      console.error(e)
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 p-2 px-3 text-emerald-400 hover:text-emerald-300 rounded-lg hover:bg-emerald-500/10 transition-all font-medium text-sm"
      >
        <Pencil className="w-4 h-4" />
        Edit Role
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 min-h-screen">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-950/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ArrowUpCircle className="w-5 h-5 text-emerald-400" />
                Edit / Promote Employee
              </h2>
              <button 
                onClick={() => setOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={handleAction} className="p-6 space-y-4">
              <input type="hidden" name="employeeId" value={employee.id} />
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">Employee Name</label>
                <input disabled value={employee.user.name} className="w-full bg-zinc-950/50 border border-zinc-900 rounded-xl px-3 py-2 text-zinc-500 outline-none cursor-not-allowed" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-300">Department</label>
                  <select required defaultValue={employee.departmentId || ""} name="departmentId" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 appearance-none">
                    <option value="" disabled>Select Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-300">Role / Designation</label>
                  <select required defaultValue={employee.designation} name="designation" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 appearance-none">
                    <option value="" disabled>Select Designation</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Senior Software Engineer">Senior Software Engineer</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Sales Representative">Sales Representative</option>
                    <option value="Accounting">Accounting</option>
                    <option value="System Admin">System Admin</option>
                    <option value="New Hire">Other (New Hire)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">New Annual Salary (USD)</label>
                <input required type="number" step="0.01" name="salary" defaultValue={employee.salary} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" placeholder="70000" />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button disabled={pending} type="submit" className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  {pending ? "Saving..." : "Update Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
