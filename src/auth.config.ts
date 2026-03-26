import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import { Role } from "@prisma/client"

export default {
  providers: [
    // 🌐 Google Login (Edge compatible)
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "missing_client_id_during_build",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "missing_secret_during_build",
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // 🔥 Store role in JWT
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.role = (user as any).role
      }
      
      // 🔥 CRITICAL FIX: Base64 Image Diet
      // If the user's profile picture is stored as a massive base64 string in the database, 
      // NextAuth automatically copies it into the token, causing a 160KB+ cookie that instantly 
      // crashes Node with an HTTP 431 Request Header Fields Too Large error. We strip it here!
      if (token.picture && token.picture.length > 1000) {
        delete token.picture
      }

      return token
    },

    // 🔥 Send role to session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as Role
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig
