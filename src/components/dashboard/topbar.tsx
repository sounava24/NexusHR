"use client"

import { signOut } from "next-auth/react"
import { LogOut, Bell, Search, User } from "lucide-react"

export default function Topbar({ user }: { user: any }) {
  return (
    <header className="h-20 bg-zinc-950/50 backdrop-blur-md border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center w-full max-w-md relative group">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 group-focus-within:text-indigo-400 transition-colors" />
        <input 
          type="text" 
          placeholder="Search everywhere..." 
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-zinc-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full animate-pulse blur-[1px]"></span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-zinc-800">
          <div className="w-9 h-9 rounded-full bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
            <User className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex flex-col hidden sm:flex">
            <span className="text-sm font-medium text-white">{user?.name}</span>
            <span className="text-xs text-zinc-500 capitalize">{user?.role?.toLowerCase()}</span>
          </div>
          
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="ml-4 p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
