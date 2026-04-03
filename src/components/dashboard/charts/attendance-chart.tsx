"use client"

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts"

type AttendanceData = {
  date: string
  present: number
  absent: number
  halfDay: number
}[]

export function AttendanceChart({ data }: { data: AttendanceData }) {
  // If no data or array is empty, show a nice fallback
  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-zinc-500 text-sm">
        No attendance data available yet.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: "#71717a", fontSize: 12 }} 
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: "#71717a", fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "#18181b", 
            borderColor: "rgba(255,255,255,0.1)",
            borderRadius: "12px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
          }}
          itemStyle={{ color: "#e4e4e7" }}
          labelStyle={{ color: "#a1a1aa", marginBottom: "4px" }}
        />
        <Area 
          type="monotone" 
          dataKey="present" 
          name="Present"
          stroke="#4f46e5" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorPresent)" 
        />
        <Area 
          type="monotone" 
          dataKey="absent" 
          name="Absent"
          stroke="#f43f5e" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorAbsent)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
