"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Map, Satellite, BarChart3,
  ShoppingCart, Users, User, LogOut, Leaf, TrendingUp, Zap, Coins, Shield, Globe,
} from "lucide-react"
import { authService } from "@/services/auth.service"
import { useRouter } from "next/navigation"
import { useLang } from "@/hooks/useLang"

type NavItem = { href: string; labelPt: string; labelEn: string; icon: React.ElementType }

const navItems: NavItem[] = [
  { href: "/dashboard",              labelPt: "Início",          labelEn: "Home",          icon: LayoutDashboard },
  { href: "/dashboard/areas",        labelPt: "Minhas Áreas",    labelEn: "My Fields",     icon: Map },
  { href: "/dashboard/satellite",    labelPt: "Satélite",        labelEn: "Satellite",     icon: Satellite },
  { href: "/dashboard/diagnostics",  labelPt: "Diagnósticos",    labelEn: "Diagnostics",   icon: BarChart3 },
  { href: "/dashboard/financeiro",   labelPt: "Fluxo de Caixa",  labelEn: "Cash Flow",     icon: TrendingUp },
  { href: "/dashboard/marketplace",  labelPt: "Marketplace",     labelEn: "Marketplace",   icon: ShoppingCart },
  { href: "/dashboard/community",    labelPt: "Comunidade",      labelEn: "Community",     icon: Users },
  { href: "/dashboard/profile",      labelPt: "Perfil",          labelEn: "Profile",       icon: User },
  { href: "/dashboard/farmcoin",     labelPt: "FARMCOIN",        labelEn: "FARMCOIN",      icon: Coins },
  { href: "/dashboard/upgrade",      labelPt: "Planos & Upgrade", labelEn: "Plans & Upgrade", icon: Zap },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const currentUser = authService.getStoredUser()
  const { lang, setLang } = useLang()

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

        {/* PT / EN toggle */}
        <button
          onClick={() => setLang(lang === "pt" ? "en" : "pt")}
          className="ml-auto flex items-center gap-1 px-2 py-1 rounded-lg bg-white/70 border border-[#d4cec5] text-xs font-bold text-gray-600 hover:bg-white transition"
          title={lang === "pt" ? "Switch to English" : "Mudar para Português"}
        >
          <Globe className="w-3 h-3" />
          {lang === "pt" ? "EN" : "PT"}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ href, labelPt, labelEn, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))
          const label = lang === "pt" ? labelPt : labelEn
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

        {/* Link Admin — visível apenas para ADMIN */}
        {currentUser?.role === "ADMIN" && (() => {
          const href = "/dashboard/admin"
          const isActive = pathname === href || pathname.startsWith(href)
          return (
            <Link
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mt-2",
                isActive
                  ? "bg-green-100 text-green-800 font-semibold"
                  : "text-stone-600 hover:bg-[#e5e0d8] hover:text-stone-900"
              )}
            >
              <Shield className={cn("w-5 h-5", isActive ? "text-green-600" : "text-gray-400")} />
              Admin
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-600" />}
            </Link>
          )
        })()}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[#d4cec5]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          {lang === "pt" ? "Sair da conta" : "Log out"}
        </button>
      </div>
    </aside>
  )
}
