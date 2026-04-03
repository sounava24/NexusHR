"use client"

import { useState } from "react"
import { Building2, UserCircle2, CheckCircle2, ChevronRight, Briefcase, Laptop, Megaphone, Users, Calculator, Lightbulb } from "lucide-react"
import { completeOnboarding } from "@/actions/onboarding"

// Helper to map department names to beautiful icons
const DEPT_ICONS: Record<string, any> = {
  "Engineering": Laptop,
  "Sales": Megaphone,
  "Human Resources": Users,
  "Finance": Calculator,
  "Marketing": Lightbulb,
  "Design": UserCircle2,
}

export function OnboardingForm({ departments }: { departments: any[] }) {
  const [selectedDept, setSelectedDept] = useState<string>("")
  const [designation, setDesignation] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const commonDesignations = [
    "Software Engineer", "Product Manager", 
    "HR Specialist", "Sales Executive", 
    "Marketing Manager", "UX Designer"
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedDept || !designation) return
    
    setLoading(true)
    const formData = new FormData()
    formData.append("departmentId", selectedDept)
    formData.append("designation", designation)
    
    await completeOnboarding(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Department Selection */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs">1</span>
          Select your Department
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {departments.map(dept => {
            const isSelected = selectedDept === dept.id
            const Icon = DEPT_ICONS[dept.name] || Building2
            
            return (
              <button
                key={dept.id}
                type="button"
                onClick={() => setSelectedDept(dept.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 relative overflow-hidden ${
                  isSelected 
                    ? 'bg-indigo-500/10 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                    : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                  </div>
                )}
                <div className={`w-10 h-10 rounded-full mb-3 flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-indigo-500/20 text-indigo-400' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-sm font-medium ${isSelected ? 'text-indigo-300' : 'text-zinc-300'}`}>
                  {dept.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Designation Selection */}
      <div className={`transition-all duration-500 ${selectedDept ? 'opacity-100 translate-y-0' : 'opacity-50 pointer-events-none translate-y-4'}`}>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
            selectedDept ? 'bg-indigo-600' : 'bg-zinc-700 text-zinc-400'
          }`}>2</span>
          What is your exact role?
        </h2>
        
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {commonDesignations.map(role => (
              <button
                key={role}
                type="button"
                onClick={() => setDesignation(role)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  designation === role 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md' 
                    : 'bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="relative mt-2">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Briefcase className="w-5 h-5 text-zinc-500" />
            </div>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="Or type a custom designation..."
              className="w-full bg-zinc-950 border-2 border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={!selectedDept || !designation || loading}
          className={`w-full flex items-center justify-center gap-2 font-bold rounded-xl py-4 transition-all ${
            selectedDept && designation
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 active:scale-[0.98]'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          {loading ? 'Setting up Profile...' : 'Enter Dashboard'}
          {!loading && <ChevronRight className="w-5 h-5" />}
        </button>
      </div>
    </form>
  )
}
