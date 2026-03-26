import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

import { Role } from "@prisma/client"

declare module "next-auth" {
  interface User {
    id: string
    role: Role
  }
  interface Session {
    user: User
  }
}

import authConfig from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // @ts-ignore - resolve type mismatch between @auth/prisma-adapter and next-auth beta
  adapter: PrismaAdapter(prisma) as any,

  // IMPORTANT: The session strategy and callbacks are now inherited from authConfig

  providers: [
    // Inherit edge-compatible providers from config (like Google)
    ...authConfig.providers,

    // 🔐 Node-only Credentials Login
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) throw new Error("Invalid credentials")

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) throw new Error("Invalid credentials")

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role, // 🔥 important
        }
      },
    }),
  ],

  events: {
    async createUser({ user }) {
      if (!user.email) return

      try {
        let defaultDept = await prisma.department.findUnique({
          where: { name: "Unassigned" },
        })

        if (!defaultDept) {
          defaultDept = await prisma.department.create({
            data: { name: "Unassigned" },
          })
        }

        // Link newly authorized OAuth users to an Employee record
        await prisma.employee.create({
          data: {
            userId: user.id!,
            departmentId: defaultDept.id,
            designation: "New Hire",
            salary: 0,
          },
        })
      } catch (error) {
        console.error("Failed to default-assign new OAuth user:", error)
        // Eating the error here prevents NextAuth from entering an infinite fail loop on signin
      }
    },
  },

  secret: process.env.AUTH_SECRET || "fallback_build_secret",
})