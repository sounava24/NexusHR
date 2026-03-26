"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  BarChart3, Users, Building, Wallet, 
  CalendarClock, CalendarRange, Settings 
} from "lucide-react"

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname()

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3, roles: ["ADMIN", "HR", "EMPLOYEE"] },
    { name: "Employees", href: "/dashboard/employees", icon: Users, roles: ["ADMIN", "HR"] },
    { name: "Departments", href: "/dashboard/departments", icon: Building, roles: ["ADMIN", "HR"] },
    { name: "Attendance", href: "/dashboard/attendance", icon: CalendarClock, roles: ["ADMIN", "HR", "EMPLOYEE"] },
    { name: "Leaves", href: "/dashboard/leaves", icon: CalendarRange, roles: ["ADMIN", "HR", "EMPLOYEE"] },
    { name: "Payroll", href: "/dashboard/payroll", icon: Wallet, roles: ["ADMIN", "HR", "EMPLOYEE"] },
  ]

  const filteredNav = navItems.filter((item) => item.roles.includes(role))

  return (
    <aside className="w-72 bg-zinc-950 border-r border-white/10 flex flex-col h-screen overflow-y-auto shrink-0 scrollbar-hide">
      <div className="p-6 flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">NexusHR</h2>
      </div>

      <div className="px-4 pb-6 flex-1 space-y-1.5">
        <div className="text-xs font-semibold text-zinc-500 tracking-wider uppercase mb-4 px-2">
          Menu Overview
        </div>
        {filteredNav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-indigo-600/10 text-indigo-400"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-300"}`} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          )
        })}
      </div>

      <div className="px-4 py-6 mt-auto border-t border-white/10">
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white transition-all duration-200 group"
        >
          <Settings className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300" />
          <span className="font-medium text-sm">Profile Settings</span>
        </Link>
      </div>
    </aside>
  )
}
