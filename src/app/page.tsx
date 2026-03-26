import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { MountainSnow, ArrowRight, Users, Clock, ShieldCheck } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function Home() {
  const session = await auth()

  // 🔥 If logged in → go to dashboard
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-indigo-600/20 to-violet-900/40 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tl from-emerald-600/10 to-teal-900/30 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Navigation */}
      <nav className="relative z-10 w-full px-6 py-6 lg:px-20 flex justify-between items-center border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <MountainSnow className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="text-xl font-bold tracking-tight">NexusHR</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="text-sm font-medium px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 transition-colors shadow-lg">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 mb-8 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          Introducing NexusHR 2.0
        </div>
        
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 max-w-5xl leading-[1.1]">
          Manage your team with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-400">
            precision and ease.
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed">
          The all-in-one premium employee management system built for modern teams. Streamline attendance, leaves, payroll, and performance in one beautiful dashboard.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/register" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-[0.98] flex items-center justify-center gap-2 text-lg">
            Start Free Trial <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/login" className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all backdrop-blur-md active:scale-[0.98] flex items-center justify-center text-lg">
            View Demo
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-5xl w-full text-left">
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors group">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Employee Hub</h3>
            <p className="text-zinc-400 leading-relaxed">Centralized directory for all employee data, departments, and role management.</p>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors group">
            <div className="w-12 h-12 bg-violet-500/20 rounded-2xl flex items-center justify-center mb-6 border border-violet-500/20 group-hover:bg-violet-500/30 transition-colors">
              <Clock className="w-6 h-6 text-violet-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Time & Attendance</h3>
            <p className="text-zinc-400 leading-relaxed">Automated tracking of work hours, leaves, and real-time attendance analytics.</p>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors group">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:bg-emerald-500/30 transition-colors">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure Payroll</h3>
            <p className="text-zinc-400 leading-relaxed">Bank-grade security for seamless payroll processing and automated salary slips.</p>
          </div>
        </div>
      </main>
    </div>
  )
}