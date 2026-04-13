"use client"

import { useEffect, useState } from "react"
import { api, getApiError } from "@/services/api"
import { authService } from "@/services/auth.service"
import {
  Users, MapPin, BarChart3, DollarSign, TrendingUp, Activity,
  Shield, ExternalLink, AlertCircle, Loader2, Lock, Unlock, ChevronDown,
} from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Overview {
  totalUsers: number
  totalAreas: number
  totalDiagnostics: number
  mrr: number
  usersLast7Days: number
  diagsLast7Days: number
}

interface PlanStat {
  plan: string
  count: number
  revenue: number
}

interface AdminUser {
  id: string
  name: string
  email: string
  plan: "FREE" | "CAMPO" | "FAZENDA"
  role: string
  city: string | null
  state: string | null
  isVerified: boolean
  createdAt: string
  _count: { areas: number; diagnostics: number }
}

interface FarmcoinTx {
  id: string
  type: string
  amount: number
  description: string
  reference: string | null
  status: string
  createdAt: string
  user: { id: string; name: string; email: string } | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function planBadge(plan: string) {
  const styles: Record<string, string> = {
    FREE: "bg-gray-100 text-gray-600 border border-gray-200",
    CAMPO: "bg-green-100 text-green-700 border border-green-200",
    FAZENDA: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[plan] ?? styles.FREE}`}>
      {plan}
    </span>
  )
}

function txTypeBadge(type: string) {
  const styles: Record<string, string> = {
    MINT: "bg-emerald-100 text-emerald-700",
    ENERGY_MINT: "bg-cyan-100 text-cyan-700",
    BURN: "bg-red-100 text-red-700",
    TRANSFER: "bg-blue-100 text-blue-700",
    SPEND: "bg-orange-100 text-orange-700",
    RECEIVE: "bg-purple-100 text-purple-700",
    LOCK: "bg-gray-100 text-gray-600",
    UNLOCK: "bg-indigo-100 text-indigo-700",
  }
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[type] ?? "bg-gray-100 text-gray-500"}`}>
      {type}
    </span>
  )
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })
}

function fmtCurrency(val: number) {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  icon: Icon,
  sub,
  color = "green",
}: {
  label: string
  value: string | number
  icon: React.ElementType
  sub?: string
  color?: string
}) {
  const colors: Record<string, string> = {
    green: "bg-green-50 text-green-600",
    blue: "bg-blue-50 text-blue-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
    cyan: "bg-cyan-50 text-cyan-600",
    rose: "bg-rose-50 text-rose-600",
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colors[color] ?? colors.green}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const user = authService.getStoredUser()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [overview, setOverview] = useState<Overview | null>(null)
  const [plans, setPlans] = useState<PlanStat[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [farmcoin, setFarmcoin] = useState<FarmcoinTx[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [planEdit, setPlanEdit] = useState<{ id: string; value: string } | null>(null)

  useEffect(() => {
    if (user?.role !== "ADMIN") return

    async function load() {
      try {
        const [statsRes, usersRes, fcRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/users?limit=50"),
          api.get("/admin/farmcoin"),
        ])

        setOverview(statsRes.data.overview)
        setPlans(statsRes.data.plans)
        setUsers(usersRes.data.users)
        setFarmcoin(fcRes.data.transactions)
      } catch (err) {
        setError(getApiError(err))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Acesso restrito ────────────────────────────────────────────────────────

  if (user?.role !== "ADMIN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Acesso restrito</h1>
        <p className="text-gray-500 text-sm">Esta área é exclusiva para administradores da plataforma.</p>
      </div>
    )
  }

  // ── Loading ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] gap-3 text-gray-400">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span>Carregando painel admin...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-red-600 font-medium">{error}</p>
      </div>
    )
  }

  async function handleChangePlan(userId: string, plan: string) {
    setActionLoading(`plan-${userId}`)
    try {
      await api.patch(`/admin/users/${userId}/plan`, { plan })
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, plan: plan as AdminUser["plan"] } : u))
      setPlanEdit(null)
    } catch { /* silently fail */ }
    finally { setActionLoading(null) }
  }

  async function handleToggleBlock(userId: string, blocked: boolean) {
    setActionLoading(`block-${userId}`)
    try {
      await api.patch(`/admin/users/${userId}/block`, { blocked })
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isVerified: !blocked } : u))
    } catch { /* silently fail */ }
    finally { setActionLoading(null) }
  }

  const planPrices: Record<string, number> = { FREE: 0, CAMPO: 49, FAZENDA: 149 }
  const planColors: Record<string, string> = {
    FREE: "border-gray-200 bg-gray-50",
    CAMPO: "border-green-200 bg-green-50",
    FAZENDA: "border-yellow-300 bg-yellow-50",
  }

  return (
    <div className="space-y-8 pb-10">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-green-600 flex items-center justify-center shadow-sm">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900">Painel Admin</h1>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-600 text-white tracking-widest">ADMIN</span>
          </div>
          <p className="text-sm text-gray-400 mt-0.5">Visão geral da plataforma SolFarm</p>
        </div>
      </div>

      {/* ── Metrics ─────────────────────────────────────────────────────────── */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard label="Total Usuários" value={overview.totalUsers} icon={Users} color="green" />
          <MetricCard label="Áreas Cadastradas" value={overview.totalAreas} icon={MapPin} color="blue" />
          <MetricCard label="Diagnósticos" value={overview.totalDiagnostics} icon={BarChart3} color="purple" />
          <MetricCard
            label="MRR"
            value={fmtCurrency(overview.mrr)}
            icon={DollarSign}
            color="yellow"
            sub="receita mensal estimada"
          />
          <MetricCard
            label="Novos usuários"
            value={overview.usersLast7Days}
            icon={TrendingUp}
            color="cyan"
            sub="últimos 7 dias"
          />
          <MetricCard
            label="Diagnósticos"
            value={overview.diagsLast7Days}
            icon={Activity}
            color="rose"
            sub="últimos 7 dias"
          />
        </div>
      )}

      {/* ── Distribuição de Planos ──────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold text-gray-800 mb-3">Distribuição de Planos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["FREE", "CAMPO", "FAZENDA"].map((plan) => {
            const stat = plans.find((p) => p.plan === plan)
            const count = stat?.count ?? 0
            const revenue = stat?.revenue ?? 0
            return (
              <div key={plan} className={`rounded-2xl border p-5 ${planColors[plan]}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-700">{plan}</span>
                  {planBadge(plan)}
                </div>
                <p className="text-3xl font-black text-gray-900">{count}</p>
                <p className="text-xs text-gray-500 mt-1">usuários neste plano</p>
                {planPrices[plan] > 0 && (
                  <p className="text-sm font-semibold text-gray-700 mt-2">
                    {fmtCurrency(revenue)}<span className="text-xs font-normal text-gray-400">/mês</span>
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Tabela de Usuários ──────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold text-gray-800 mb-3">Usuários</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Nome / Email", "Plano", "Localização", "Diagnóst.", "Áreas", "Cadastro", "Ações"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        {u.name}
                        {!u.isVerified && (
                          <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">Bloqueado</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">{u.email}</div>
                    </td>
                    <td className="px-4 py-3">{planBadge(u.plan)}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {u.city && u.state ? `${u.city}, ${u.state}` : u.state ?? u.city ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-gray-700">{u._count.diagnostics}</td>
                    <td className="px-4 py-3 text-center font-medium text-gray-700">{u._count.areas}</td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{fmtDate(u.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {/* Mudar Plano */}
                        {planEdit?.id === u.id ? (
                          <div className="flex items-center gap-1">
                            <select
                              value={planEdit.value}
                              onChange={e => setPlanEdit({ id: u.id, value: e.target.value })}
                              className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                              {["FREE", "CAMPO", "FAZENDA"].map(p => <option key={p}>{p}</option>)}
                            </select>
                            <button
                              onClick={() => handleChangePlan(u.id, planEdit.value)}
                              disabled={actionLoading === `plan-${u.id}`}
                              className="text-xs bg-green-600 text-white px-2 py-1 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                            >
                              {actionLoading === `plan-${u.id}` ? <Loader2 className="w-3 h-3 animate-spin" /> : "OK"}
                            </button>
                            <button onClick={() => setPlanEdit(null)} className="text-xs text-gray-400 hover:text-gray-600 px-1">✕</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setPlanEdit({ id: u.id, value: u.plan })}
                            className="text-xs flex items-center gap-1 text-gray-500 hover:text-green-700 border border-gray-200 hover:border-green-400 px-2 py-1 rounded-lg transition-colors"
                          >
                            Plano <ChevronDown className="w-3 h-3" />
                          </button>
                        )}
                        {/* Bloquear / Desbloquear */}
                        <button
                          onClick={() => handleToggleBlock(u.id, u.isVerified)}
                          disabled={actionLoading === `block-${u.id}`}
                          className={`text-xs flex items-center gap-1 px-2 py-1 rounded-lg border font-semibold transition-colors disabled:opacity-50 ${
                            u.isVerified
                              ? "text-red-500 border-red-200 hover:bg-red-50"
                              : "text-green-600 border-green-200 hover:bg-green-50"
                          }`}
                        >
                          {actionLoading === `block-${u.id}` ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : u.isVerified ? (
                            <><Lock className="w-3 h-3" /> Bloquear</>
                          ) : (
                            <><Unlock className="w-3 h-3" /> Liberar</>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">Nenhum usuário encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FARMCOIN Transações ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-base font-bold text-gray-800 mb-3">FARMCOIN — Últimas Transações</h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Usuário", "Tipo", "Quantidade", "Descrição", "Data"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {farmcoin.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      {tx.user ? (
                        <>
                          <div className="font-medium text-gray-900">{tx.user.name}</div>
                          <div className="text-xs text-gray-400">{tx.user.email}</div>
                        </>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">{txTypeBadge(tx.type)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${tx.amount >= 0 ? "text-green-600" : "text-red-500"}`}>
                        {tx.amount >= 0 ? "+" : ""}{tx.amount.toLocaleString("pt-BR", { maximumFractionDigits: 4 })} FC
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                      {tx.reference ? (
                        <span className="flex items-center gap-1">
                          {tx.description}
                          <ExternalLink className="w-3 h-3 text-gray-300 shrink-0" />
                        </span>
                      ) : tx.description}
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{fmtDate(tx.createdAt)}</td>
                  </tr>
                ))}
                {farmcoin.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-400">Nenhuma transação encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
