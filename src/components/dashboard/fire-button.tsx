"use client"

import { fireEmployee } from "@/actions/employee"
import { useTransition } from "react"
import { Flame } from "lucide-react"

export default function FireButton({ employeeId, currentStatus }: { employeeId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition()

  if (currentStatus === "TERMINATED") {
    return <span className="text-xs font-semibold text-red-500 bg-red-500/10 px-2 flex items-center h-8 rounded-md truncate max-w-[100px] justify-center ml-auto">Terminated</span>
  }

  return (
    <button
      onClick={() => startTransition(() => { fireEmployee(employeeId) })}
      disabled={isPending}
      className="flex items-center justify-center min-w-[80px] h-8 ml-auto gap-1.5 p-2 px-3 text-red-400 hover:text-red-300 rounded-lg bg-red-500/5 hover:bg-red-500/10 transition-all font-medium text-sm disabled:opacity-50"
    >
      <Flame className="w-4 h-4" />
      {isPending ? "Firing..." : "Fire"}
    </button>
  )
}
