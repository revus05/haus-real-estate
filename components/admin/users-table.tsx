"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string | Date
  _count: { properties: number; leads: number }
}

export function UsersTable({ users: initialUsers }: { users: User[] }) {
  const [users, setUsers] = useState(initialUsers)
  const router = useRouter()

  async function handleRoleChange(id: string, role: string) {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role }),
    })
    if (!res.ok) { toast.error("Не удалось обновить роль"); return }
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)))
    toast.success("Роль обновлена")
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить этого пользователя? Это действие нельзя отменить.")) return
    const res = await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) { toast.error("Не удалось удалить пользователя"); return }
    setUsers((prev) => prev.filter((u) => u.id !== id))
    toast.success("Пользователь удален")
    router.refresh()
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-medium text-muted-foreground">Пользователь</th>
            <th className="text-left p-3 font-medium text-muted-foreground hidden md:table-cell">Объявления</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Роль</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Действия</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-muted/30">
              <td className="p-3">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </td>
              <td className="p-3 hidden md:table-cell">
                <Badge variant="outline">{user._count.properties}</Badge>
              </td>
              <td className="p-3">
                <Select value={user.role} onValueChange={(v) => handleRoleChange(user.id, v)}>
                  <SelectTrigger className="w-[110px] h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["USER", "REALTOR", "ADMIN"].map((r) => (
                      <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td className="p-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(user.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
