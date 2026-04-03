import { prisma } from "@/lib/prisma"
import { UserCircle2, Sparkles } from "lucide-react"
import { OnboardingForm } from "./onboarding-form"

export const dynamic = "force-dynamic"

export default async function OnboardingPage() {
  const departments = await prisma.department.findMany({
    where: {
      name: { not: "Unassigned" }
    },
    orderBy: { name: "asc" }
  })

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-[2rem] p-8 md:p-10 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Welcome to NexusHR</h1>
          <p className="text-zinc-400 text-base max-w-md mx-auto">
            Your Google account has been verified. Let's finish setting up your work profile to access the dashboard.
          </p>
        </div>

        <OnboardingForm departments={departments} />
      </div>
    </div>
  )
}
