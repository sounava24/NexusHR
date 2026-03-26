"use client"

import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { useState } from "react"

interface AttendanceCalendarProps {
  logs: { date: Date; status: string }[]
}

export default function AttendanceCalendar({ logs }: AttendanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Calculate days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Calculate first day of the month (0-6)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ]

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  // Create a map of date string (YYYY-MM-DD) to status
  const statusMap = new Map<string, string>()
  logs.forEach(log => {
    const d = new Date(log.date)
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    statusMap.set(key, log.status)
  })

  // Pre-calculate cells
  const blanks = Array.from({ length: firstDay }, (_, i) => i)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="bg-zinc-950 border border-white/10 rounded-2xl shadow-xl overflow-hidden mt-8">
      <div className="p-6 border-b border-white/10 bg-zinc-900/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-white">My Monthly Overview</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium text-white min-w-[120px] text-center">
            {monthNames[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-7 gap-2 md:gap-4 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 md:gap-4">
          {blanks.map(blank => (
            <div key={`blank-${blank}`} className="aspect-square rounded-xl bg-transparent" />
          ))}
          
          {days.map(day => {
            const dateKey = `${year}-${month}-${day}`
            const status = statusMap.get(dateKey)
            
            let bgClass = "bg-zinc-900/50 border-white/5 text-zinc-400"
            let borderClass = "border"
            
            if (status === "PRESENT") {
              bgClass = "bg-emerald-500/10 text-emerald-400 font-bold shadow-[inset_0_0_20px_rgba(16,185,129,0.1)]"
              borderClass = "border border-emerald-500/30"
            } else if (status === "ABSENT") {
              bgClass = "bg-red-500/10 text-red-400 font-bold shadow-[inset_0_0_20px_rgba(239,68,68,0.1)]"
              borderClass = "border border-red-500/30"
            } else if (status === "HALF_DAY") {
              bgClass = "bg-orange-500/10 text-orange-400 font-bold shadow-[inset_0_0_20px_rgba(249,115,22,0.1)]"
              borderClass = "border border-orange-500/30"
            } else {
              // Highlight today if no record yet
              const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year
              if (isToday) {
                borderClass = "border border-indigo-500/50"
                bgClass = "bg-indigo-500/10 text-indigo-300 font-semibold"
              }
            }

            return (
              <div 
                key={day} 
                className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all hover:scale-105 cursor-default ${bgClass} ${borderClass}`}
                title={status || "No Record"}
              >
                <span className="text-base sm:text-lg">{day}</span>
                {status && <span className="text-[10px] uppercase font-bold tracking-tighter mt-1 hidden sm:block opacity-80">{status}</span>}
              </div>
            )
          })}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="w-3 h-3 rounded-full bg-emerald-500/40 border border-emerald-500"></span> Present
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="w-3 h-3 rounded-full bg-red-500/40 border border-red-500"></span> Absent
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span className="w-3 h-3 rounded-full bg-orange-500/40 border border-orange-500"></span> Half Day
          </div>
        </div>
      </div>
    </div>
  )
}
