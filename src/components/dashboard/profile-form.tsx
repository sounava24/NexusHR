"use client"

import { useState } from "react"
import { updateProfile } from "@/actions/profile"
import { User } from "next-auth"
import { Camera, Save, Loader2 } from "lucide-react"

export default function ProfileForm({ user }: { user: User }) {
  const [name, setName] = useState(user.name || "")
  const [imagePreview, setImagePreview] = useState(user.image || "")
  const [imageBase64, setImageBase64] = useState("")
  const [isPending, setPending] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image must be less than 2MB" })
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setImagePreview(base64String)
        setImageBase64(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPending(true)
    setMessage({ type: "", text: "" })

    try {
      const formData = new FormData()
      formData.append("name", name)
      if (imageBase64) formData.append("image", imageBase64)

      await updateProfile(formData)
      setMessage({ type: "success", text: "Profile updated successfully!" })
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to update profile" })
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-950 p-8 rounded-2xl border border-white/10 shadow-xl">
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-zinc-900 shadow-2xl bg-zinc-800 flex items-center justify-center">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-zinc-500 font-bold">{name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-500 transition-colors shadow-lg border-2 border-zinc-950 group-hover:scale-105 active:scale-95">
              <Camera className="w-5 h-5 text-white" />
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-400">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white"
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-400">Email Address</label>
              <input
                type="email"
                disabled
                value={user.email || ""}
                className="w-full px-4 py-3 bg-zinc-900/50 border border-white/5 rounded-xl text-zinc-500 cursor-not-allowed"
              />
              <p className="text-xs text-zinc-500">Email address cannot be changed.</p>
            </div>
          </div>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl text-sm ${message.type === "error" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}>
            {message.text}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-white/5">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-xl hover:bg-zinc-200 transition-colors shadow-lg disabled:opacity-50 active:scale-[0.98]"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
