import Link from "next/link"
import { MountainSnow } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-zinc-950/50 backdrop-blur-xl mt-20 relative z-10">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                <MountainSnow className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">NexusHR</span>
            </div>
            <p className="text-sm leading-6 text-zinc-400 max-w-xs">
              The premium platform for modern organizations to manage their workforce, payroll, and performance with precision.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Platform</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link href="#" className="text-sm leading-6 text-zinc-400 hover:text-white transition-colors">Features</Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm leading-6 text-zinc-400 hover:text-white transition-colors">Pricing</Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm leading-6 text-zinc-400 hover:text-white transition-colors">Integrations</Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Resources</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link href="#" className="text-sm leading-6 text-zinc-400 hover:text-white transition-colors">Documentation</Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm leading-6 text-zinc-400 hover:text-white transition-colors">Guides</Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm leading-6 text-zinc-400 hover:text-white transition-colors">Help Center</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link href="#" className="text-sm leading-6 text-zinc-400 hover:text-white transition-colors">About</Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm leading-6 text-zinc-400 hover:text-white transition-colors">Blog</Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm leading-6 text-zinc-400 hover:text-white transition-colors">Careers</Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link href="#" className="text-sm leading-6 text-zinc-400 hover:text-white transition-colors">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href="#" className="text-sm leading-6 text-zinc-400 hover:text-white transition-colors">Terms of Service</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 sm:mt-16 flex justify-between items-center">
          <p className="text-xs leading-5 text-zinc-400">&copy; {new Date().getFullYear()} NexusHR, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
