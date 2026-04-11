"use client"

import { Bell, Search } from "lucide-react"
import { authService } from "@/services/auth.service"
import { useEffect, useState } from "react"

export function Header({ title }: { title?: string }) {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setUser(authService.getStoredUser())
  }, [])

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
      <div>
        {title && <h1 className="text-lg font-bold text-gray-900">{title}</h1>}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-gray-400" />
          <input
            className="pl-9 pr-4 h-9 text-sm bg-gray-50 border border-gray-200 rounded-xl w-56 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Buscar..."
          />
        </div>

        {/* Notificações */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Avatar */}
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center text-white font-bold text-sm">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-gray-900 leading-none">{user.name?.split(" ")[0]}</p>
              <p className="text-xs text-gray-400 mt-0.5">{user.plan}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
