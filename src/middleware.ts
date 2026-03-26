import { NextResponse } from "next/server"
import NextAuth from "next-auth"
import authConfig from "@/auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const session = req.auth
  const url = new URL(req.url)

  console.log(`[Middleware] Path: ${url.pathname} | Session present: !!${!!session} | Role: ${session?.user?.role}`);

  // 🚫 Not logged in → redirect to login
  if (!session) {
    if (url.pathname === "/login") return NextResponse.next()
    return NextResponse.redirect(new URL("/login", req.url))
  }

  const role = session.user.role

  // 🔥 Example restrictions
  if (url.pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (url.pathname.startsWith("/dashboard/employees") && role === "EMPLOYEE") {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*"],
}