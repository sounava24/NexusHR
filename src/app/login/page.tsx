"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { MountainSnow } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div className="flex h-screen bg-zinc-950 text-white font-sans selection:bg-indigo-500/30">
      {/* Left side: branding/image */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden">
        {/* Subtle background gradient blob */}
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-indigo-600/20 to-violet-900/40 blur-3xl rounded-full" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-4 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10 mb-8 shadow-2xl">
            <MountainSnow className="w-20 h-20 text-indigo-400" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">NexusHR</h1>
          <p className="text-zinc-400 text-lg max-w-md text-center">
            Streamline your workforce management with precision and ease.
          </p>
        </div>
      </div>

      {/* Right side: login form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 lg:px-20 relative z-10">
        
        <div className="w-full max-w-md p-8 sm:p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl space-y-8">
          <div className="space-y-2">
           <div className="flex justify-between items-center"> <h2 className="text-3xl font-semibold tracking-tight">Welcome back</h2>
             <button className="border border-white/10 bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl" onClick={() => router.push("/")}>Home</button></div>
            <p className="text-sm text-zinc-400">Sign in to your account to continue</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white text-black font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-zinc-900/50 px-2 text-zinc-400">Or continue with credentials</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                onClick={() =>
                  signIn("credentials", {
                    email,
                    password,
                    callbackUrl: "/dashboard",
                  })
                }
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-[0.98]"
              >
                Sign In
              </button>
            </div>
          </div>
          <p className="text-center text-sm text-zinc-400 mt-6">
            Don't have an account?{" "}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}