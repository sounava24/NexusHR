"use client"

import { useState } from "react"
import { createEmployee } from "@/actions/employee"
import { UserPlus, X } from "lucide-react"

export default function AddEmployeeDialog({ departments }: { departments: any[] }) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleAction(formData: FormData) {
    setPending(true)
    try {
      await createEmployee(formData)
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
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] active:scale-95"
      >
        <UserPlus className="w-4 h-4" />
        <span>Add Employee</span>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 min-h-screen">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-950/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                New Employee
              </h2>
              <button 
                onClick={() => setOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={handleAction} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-300">Full Name</label>
                  <input required name="name" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" placeholder="John Doe" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-300">Email Address</label>
                  <input required type="email" name="email" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" placeholder="john@company.com" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">Password</label>
                <input required type="password" name="password" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" placeholder="••••••••" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-300">Department</label>
                  <select required defaultValue="" name="departmentId" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 appearance-none">
                    <option value="" disabled>Select Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-300">Role / Designation</label>
                  <select required defaultValue="" name="designation" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 appearance-none">
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
                <label className="text-sm font-medium text-zinc-300">Annual Salary (USD)</label>
                <input required type="number" step="0.01" name="salary" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" placeholder="60000" />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button disabled={pending} type="submit" className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                  {pending ? "Saving..." : "Save Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
