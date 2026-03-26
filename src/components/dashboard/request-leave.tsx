"use client"

import { useState } from "react"
import { requestLeave } from "@/actions/leaves"
import { CalendarRange, X } from "lucide-react"

export default function RequestLeaveDialog() {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState(false)

  async function handleAction(formData: FormData) {
    setPending(true)
    try {
      await requestLeave(formData)
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
        <CalendarRange className="w-4 h-4" />
        <span>Request Leave</span>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 min-h-screen">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-950/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CalendarRange className="w-5 h-5 text-indigo-400" />
                Time Off Request
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
                  <label className="text-sm font-medium text-zinc-300">Start Date</label>
                  <input required type="date" name="startDate" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-300">End Date</label>
                  <input required type="date" name="endDate" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-zinc-300">Reason</label>
                <textarea required name="reason" rows={3} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-none" placeholder="Please provide details for your leave request..."></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-white/10 mt-6">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button disabled={pending} type="submit" className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                  {pending ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
