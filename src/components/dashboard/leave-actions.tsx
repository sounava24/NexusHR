"use client"

import { useTransition } from "react"
import { updateLeaveStatus } from "@/actions/leaves"
import { Check, X } from "lucide-react"
import { LeaveStatus } from "@prisma/client"

export default function LeaveActionButtons({ leaveId }: { leaveId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
      <button 
        disabled={isPending}
        onClick={() => startTransition(() => updateLeaveStatus(leaveId, "APPROVED"))}
        className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors border border-emerald-500/20"
        title="Approve"
      >
        <Check className="w-4 h-4" />
      </button>
      <button 
        disabled={isPending}
        onClick={() => startTransition(() => updateLeaveStatus(leaveId, "REJECTED"))}
        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20"
        title="Reject"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
