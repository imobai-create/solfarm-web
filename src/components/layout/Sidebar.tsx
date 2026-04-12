"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Map, Satellite, BarChart3,
  ShoppingCart, Users, User, LogOut, Leaf, TrendingUp, Zap,
} from "lucide-react"
import { authService } from "@/services/auth.service"
import { useRouter } from "next/navigation"

const navItems = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard },
  { href: "/dashboard/areas", label: "Minhas Áreas", icon: Map },
  { href: "/dashboard/satellite", label: "Satélite", icon: Satellite },
  { href: "/dashboard/diagnostics", label: "Diagnósticos", icon: BarChart3 },
  { href: "/dashboard/financeiro", label: "Fluxo de Caixa", icon: TrendingUp },
  { href: "/dashboard/marketplace", label: "Marketplace", icon: ShoppingCart },
  { href: "/dashboard/community", label: "Comunidade", icon: Users },
  { href: "/dashboard/profile", label: "Perfil", icon: User },
  { href: "/dashboard/upgrade", label: "Planos & Upgrade", icon: Zap },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await authService.logout()
    router.push("/login")
  }

  return (
    <aside className="flex flex-col w-64 min-h-screen fixed left-0 top-0 bottom-0 z-30" style={{ backgroundColor: '#f0ece4', borderRight: '1px solid #d4cec5' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[#d4cec5]">
        <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-xl font-black text-gray-900">Sol</span>
          <span className="text-xl font-black text-green-600">Farm</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-green-100 text-green-800 font-semibold"
                  : "text-stone-600 hover:bg-[#e5e0d8] hover:text-stone-900"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-green-600" : "text-gray-400")} />
              {label}
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-600" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[#d4cec5]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sair da conta
        </button>
      </div>
    </aside>
  )
}
