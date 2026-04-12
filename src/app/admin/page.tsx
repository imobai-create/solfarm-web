"use client"

import { useEffect, useState } from "react"
import { api } from "@/services/api"
import { authService } from "@/services/auth.service"
import { useRouter } from "next/navigation"
import {
  Users, Map, BarChart3, TrendingUp, DollarSign,
  Activity, RefreshCw, Crown, Zap, Leaf,
} from "lucide-react"

const PLAN_ICON: Record<string, React.ReactNode> = {
  FREE: <Leaf className="w-4 h-4 text-green-500" />,
  CAMPO: <Zap className="w-4 h-4 text-amber-500" />,
  FAZENDA: <Crown className="w-4 h-4 text-purple-500" />,
}

const HEALTH_COLOR: Record<string, string> = {
  SAUDAVEL: "text-green-600 bg-green-50",
  ATENCAO: "text-amber-600 bg-amber-50",
  CRITICO: "text-red-600 bg-red-50",
  DESCONHECIDO: "text-gray-500 bg-gray-50",
}

const HEALTH_LABEL: Record<string, string> = {
  SAUDAVEL: "Saudável", ATENCAO: "Atenção", CRITICO: "Crítico", DESCONHECIDO: "N/D",
}

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"overview" | "users" | "diagnostics">("overview")
  const router = useRouter()

  useEffect(() => {
    const user = authService.getStoredUser()
    if (!user || user.role !== "ADMIN") {
      router.replace("/dashboard")
      return
    }
    loadStats()
  }, [])

  async function loadStats() {
    setLoading(true)
    try {
      const res = await api.get("/admin/stats")
      setStats(res.data)
    } catch {
      router.replace("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
        <div className="flex items-center gap-3 text-stone-500">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Carregando painel admin...
        </div>
      </div>
    )
  }

  if (!stats) return null
  const { overview, plans, recentUsers, recentDiagnostics } = stats

  const statCards = [
    { icon: Users, label: "Total de usuários", value: overview.totalUsers, sub: `+${overview.usersLast7Days} esta semana`, color: "blue" },
    { icon: Map, label: "Áreas cadastradas", value: overview.totalAreas, sub: "propriedades monitoradas", color: "green" },
    { icon: Activity, label: "Diagnósticos", value: overview.totalDiagnostics, sub: `+${overview.diagsLast7Days} esta semana`, color: "purple" },
    { icon: DollarSign, label: "MRR estimado", value: `R$ ${overview.mrr.toLocaleString("pt-BR")}`, sub: "receita mensal recorrente", color: "amber" },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Painel Admin</h1>
            <p className="text-stone-500 text-sm mt-1">SolFarm — visão geral da plataforma</p>
          </div>
          <button onClick={loadStats} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-600 text-sm hover:bg-stone-50 transition">
            <RefreshCw className="w-4 h-4" /> Atualizar
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ icon: Icon, label, value, sub, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
              <div className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 text-${color}-600`} />
              </div>
              <p className="text-2xl font-black text-gray-900">{value}</p>
              <p className="text-xs font-semibold text-stone-500 mt-1">{label}</p>
              <p className="text-xs text-stone-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Planos */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 mb-6">
          <h2 className="text-base font-bold text-gray-900 mb-4">Distribuição de Planos</h2>
          <div className="grid grid-cols-3 gap-4">
            {plans.map((p: any) => (
              <div key={p.plan} className="text-center p-4 rounded-xl bg-stone-50 border border-stone-100">
                <div className="flex justify-center mb-2">{PLAN_ICON[p.plan]}</div>
                <p className="text-2xl font-black text-gray-900">{p.count}</p>
                <p className="text-sm font-semibold text-stone-500">{p.plan}</p>
                {p.revenue > 0 && (
                  <p className="text-xs text-green-600 font-semibold mt-1">R$ {p.revenue}/mês</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(["overview", "users", "diagnostics"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                tab === t ? "bg-green-600 text-white" : "bg-white text-stone-500 border border-stone-200 hover:bg-stone-50"
              }`}
            >
              {t === "overview" ? "Visão geral" : t === "users" ? "Usuários" : "Diagnósticos"}
            </button>
          ))}
        </div>

        {/* Usuários recentes */}
        {tab !== "diagnostics" && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-stone-100">
              <h2 className="font-bold text-gray-900">Usuários Recentes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-stone-50 text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    <th className="px-6 py-3 text-left">Nome</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Plano</th>
                    <th className="px-6 py-3 text-left">Localização</th>
                    <th className="px-6 py-3 text-left">Cadastro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {recentUsers.map((u: any) => (
                    <tr key={u.id} className="hover:bg-stone-50 transition">
                      <td className="px-6 py-3 text-sm font-semibold text-gray-900">{u.name}</td>
                      <td className="px-6 py-3 text-sm text-stone-500">{u.email}</td>
                      <td className="px-6 py-3">
                        <span className="flex items-center gap-1.5 text-xs font-semibold">
                          {PLAN_ICON[u.plan]} {u.plan}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-stone-500">
                        {u.city && u.state ? `${u.city}, ${u.state}` : "—"}
                      </td>
                      <td className="px-6 py-3 text-xs text-stone-400">
                        {new Date(u.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Diagnósticos recentes */}
        {tab !== "users" && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100">
              <h2 className="font-bold text-gray-900">Diagnósticos Recentes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-stone-50 text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    <th className="px-6 py-3 text-left">Área</th>
                    <th className="px-6 py-3 text-left">Produtor</th>
                    <th className="px-6 py-3 text-left">Score</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {recentDiagnostics.map((d: any) => (
                    <tr key={d.id} className="hover:bg-stone-50 transition">
                      <td className="px-6 py-3 text-sm font-semibold text-gray-900">
                        {d.area} <span className="text-stone-400 font-normal">({d.hectares} ha)</span>
                      </td>
                      <td className="px-6 py-3 text-sm text-stone-500">{d.user}</td>
                      <td className="px-6 py-3 text-sm font-bold text-gray-900">{d.score}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${HEALTH_COLOR[d.healthStatus] ?? "text-gray-500 bg-gray-50"}`}>
                          {HEALTH_LABEL[d.healthStatus] ?? d.healthStatus}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-xs text-stone-400">
                        {new Date(d.createdAt).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
