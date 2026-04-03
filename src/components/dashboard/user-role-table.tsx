"use client"

import { useState } from "react"
import { Role } from "@prisma/client"
import { ShieldCheck, ShieldAlert, User as UserIcon } from "lucide-react"
import { updateUserRole } from "@/actions/admin"

type UserWithEmployee = {
  id: string
  name: string | null
  email: string | null
  role: Role
  employee?: {
    designation: string
    department: { name: string }
  } | null
}

export function UserRoleTable({ users }: { users: UserWithEmployee[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState("")

  async function handleRoleChange(userId: string, newRole: Role) {
    setLoadingId(userId)
    setError("")
    try {
      await updateUserRole(userId, newRole)
    } catch (e: any) {
      setError(e.message || "Failed to update role")
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mt-6">
      {error && <div className="p-4 bg-red-500/10 text-red-500 text-sm border-b border-red-500/20">{error}</div>}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-white/5 text-zinc-400">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Designation</th>
              <th className="px-6 py-4 font-medium">Current Role</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-400">
                  {user.employee?.designation || "N/A"}
                  <div className="text-xs text-zinc-500">{user.employee?.department?.name || "Unassigned"}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                    user.role === 'ADMIN' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    user.role === 'HR' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                    'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                  }`}>
                    {user.role === 'ADMIN' && <ShieldAlert className="w-3.5 h-3.5" />}
                    {user.role === 'HR' && <ShieldCheck className="w-3.5 h-3.5" />}
                    {user.role === 'EMPLOYEE' && <UserIcon className="w-3.5 h-3.5" />}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select
                    disabled={loadingId === user.id}
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                    className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    <option value="EMPLOYEE">Make Employee</option>
                    <option value="HR">Make HR</option>
                    <option value="ADMIN">Make Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
