import { auth } from "@/auth"
import { redirect } from "next/navigation"
import ProfileForm from "@/components/dashboard/profile-form"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function ProfilePage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Your Profile</h1>
        <p className="text-zinc-400 mt-1">Manage your personal information and adjust your account settings.</p>
      </div>
      
      <ProfileForm user={dbUser || session.user} />
    </div>
  )
}
