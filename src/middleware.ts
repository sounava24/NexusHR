import { NextResponse } from "next/server"
import NextAuth from "next-auth"
import authConfig from "@/auth.config"

const { auth } = NextAuth(authConfig)

export default auth(async (req) => {
  const url = new URL(req.url)

  // 1. Skip check if they are already on the Suspended page to avoid a loop
  if (url.pathname === '/suspended') {
    return NextResponse.next();
  }

  try {
    // 2. Call your live CRM securely
    const CRM_DOMAIN = 'https://crm-p1o7.onrender.com'; // Your live Render URL
    const API_KEY = process.env.CRM_API_KEY; 
    
    // Add X-API-KEY header to securely identify the client
    const response = await fetch(`${CRM_DOMAIN}/api/status`, {
      headers: {
        'x-api-key': API_KEY || ''
      },
      next: { revalidate: 3600 } // Cache this response so it only checks once per hour
    });
    
    const data = await response.json();

    // 3. The Kill Switch Activation
    if (data?.status === 'suspended') {
      return NextResponse.redirect(new URL('/suspended', req.url));
    }
  } catch (error) {
    // If your CRM crashes, we fail silently so their site stays online
    console.error('CRM Status Check Failed:', error);
  }

  // --- AUTH PORTION ---
  const session = req.auth
  const isDashboardRoute = url.pathname.startsWith("/dashboard");

  // console.log(`[Middleware] Path: ${url.pathname} | Session present: !!${!!session} | Role: ${session?.user?.role}`);

  if (isDashboardRoute) {
    // 🚫 Not logged in → redirect to login
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    const role = session.user?.role

    // 🔥 Example restrictions
    if (url.pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    if (url.pathname.startsWith("/dashboard/employees") && role === "EMPLOYEE") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}