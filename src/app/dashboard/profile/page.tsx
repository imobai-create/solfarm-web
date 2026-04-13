"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/services/api"
import { authService } from "@/services/auth.service"
import { formatDate } from "@/lib/utils"
import { User, Mail, Phone, MapPin, Shield, Bell, LogOut, AlertCircle, CheckCircle2, Zap, Wallet, ExternalLink, Loader2 } from "lucide-react"

const PLAN_LIMITS: Record<string, any> = {
  FREE:       { areas: 1,   diagnostics: 3,   name: "Grátis",    color: "text-gray-600",   bg: "bg-gray-100" },
  CAMPO:      { areas: 5,   diagnostics: 20,  name: "Campo",     color: "text-blue-600",   bg: "bg-blue-50" },
  FAZENDA:    { areas: 999, diagnostics: 999, name: "Fazenda",   color: "text-green-600",  bg: "bg-green-50" },
  STARTER:    { areas: 5,   diagnostics: 20,  name: "Starter",   color: "text-blue-600",   bg: "bg-blue-50" },
  PRO:        { areas: 20,  diagnostics: 100, name: "Pro",       color: "text-green-600",  bg: "bg-green-50" },
  ENTERPRISE: { areas: 999, diagnostics: 999, name: "Enterprise",color: "text-purple-600", bg: "bg-purple-50" },
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "", state: "" })
  const [wallet, setWallet] = useState("")
  const [walletSaving, setWalletSaving] = useState(false)
  const [walletMsg, setWalletMsg] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    const stored = authService.getStoredUser()
    setUser(stored)
    setForm({ name: stored?.name ?? "", phone: stored?.phone ?? "", state: stored?.state ?? "" })

    Promise.all([
      api.get("/areas/stats").catch(() => ({ data: {} })),
    ]).then(([statsRes]) => setStats(statsRes.data))
  }, [])

  async function saveProfile() {
    setSaving(true)
    try {
      const res = await api.patch("/auth/me", form)
      const updated = { ...user, ...form }
      localStorage.setItem("solfarm_user", JSON.stringify(updated))
      setUser(updated)
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      // silently fail for demo
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  async function saveWallet() {
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      setWalletMsg({ type: "error", text: "Endereço inválido. Deve começar com 0x e ter 42 caracteres." })
      return
    }
    setWalletSaving(true)
    setWalletMsg(null)
    try {
      await api.patch("/auth/wallet", { walletAddress: wallet })
      const updated = { ...user, walletAddress: wallet }
      localStorage.setItem("solfarm_user", JSON.stringify(updated))
      setUser(updated)
      setWalletMsg({ type: "success", text: "Carteira registrada! Seus FARMCOINs serão enviados para este endereço." })
    } catch (err: any) {
      setWalletMsg({ type: "error", text: err?.response?.data?.error ?? "Erro ao salvar carteira." })
    } finally {
      setWalletSaving(false)
    }
  }

  function handleLogout() {
    authService.logout()
    router.push("/login")
  }

  if (!user) return null

  const plan = PLAN_LIMITS[user.plan ?? "FREE"]
  const firstName = user.name?.split(" ")[0]

  return (
    <div className="min-h-screen">
      <Header title="Perfil" />

      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Minha Conta</h1>
          <p className="text-gray-500 text-sm mt-0.5">Gerencie seu perfil e assinatura</p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-5 border border-green-100">
            <CheckCircle2 className="w-4 h-4" /> Perfil atualizado com sucesso!
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Profile card */}
          <div className="space-y-5">
            {/* Avatar card */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto mb-4 text-white text-3xl font-black">
                  {user.name?.split(" ").map((n: string) => n[0]).slice(0, 2).join("") ?? "?"}
                </div>
                <h2 className="text-xl font-black text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{user.email}</p>
                <div className="mt-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${plan.bg} ${plan.color}`}>
                    <Zap className="w-3.5 h-3.5" />
                    Plano {plan.name}
                  </span>
                </div>
                {user.role && (
                  <p className="text-xs text-gray-400 mt-2">
                    {user.role === "PRODUCER" ? "🌱 Produtor Rural" : "🏪 Fornecedor"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Usage */}
            <Card>
              <CardHeader><CardTitle className="text-base">Uso do plano</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-500">Áreas cadastradas</span>
                    <span className="font-bold text-gray-900">
                      {stats?.totalAreas ?? 0}/{plan.areas === 999 ? "∞" : plan.areas}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${Math.min(100, ((stats?.totalAreas ?? 0) / (plan.areas === 999 ? 1 : plan.areas)) * 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-500">Diagnósticos realizados</span>
                    <span className="font-bold text-gray-900">
                      {stats?.diagnosticsRun ?? 0}/{plan.diagnostics === 999 ? "∞" : plan.diagnostics}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.min(100, ((stats?.diagnosticsRun ?? 0) / (plan.diagnostics === 999 ? 1 : plan.diagnostics)) * 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Danger zone */}
            <Card className="border-red-100">
              <CardContent className="p-4">
                <Button
                  variant="outline"
                  className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" /> Sair da conta
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-2 space-y-5">
            {/* Personal info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Informações pessoais</CardTitle>
                  {!editing ? (
                    <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Editar</Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditing(false)}>Cancelar</Button>
                      <Button size="sm" onClick={saveProfile} loading={saving}>Salvar</Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { icon: User, label: "Nome completo", key: "name", value: user.name, type: "text" },
                  { icon: Mail, label: "E-mail", key: "email", value: user.email, type: "email", readOnly: true },
                  { icon: Phone, label: "WhatsApp", key: "phone", value: user.phone, type: "tel" },
                  { icon: MapPin, label: "Estado (UF)", key: "state", value: user.state, type: "text" },
                ].map(({ icon: Icon, label, key, value, type, readOnly }) => (
                  <div key={key} className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                      {editing && !readOnly ? (
                        <input
                          type={type}
                          value={form[key as keyof typeof form] ?? ""}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                          className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
                        />
                      ) : (
                        <p className={`text-sm font-medium ${readOnly ? "text-gray-400" : "text-gray-900"}`}>
                          {value ?? "—"}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Plan */}
            <Card>
              <CardHeader><CardTitle>Assinatura</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 mb-5">
                  <div>
                    <p className="font-bold text-gray-900">Plano {plan.name}</p>
                    <p className="text-sm text-gray-500">
                      {plan.areas === 999 ? "Áreas ilimitadas" : `Até ${plan.areas} área${plan.areas > 1 ? "s" : ""}`} ·{" "}
                      {plan.diagnostics === 999 ? "Diagnósticos ilimitados" : `${plan.diagnostics} diagnósticos/mês`}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${plan.bg} ${plan.color}`}>
                    {user.plan ?? "FREE"}
                  </span>
                </div>

                {user.plan === "FREE" && (
                  <div className="space-y-3">
                    {[
                      { plan: "Starter", price: "R$49/mês", areas: 5, diag: 20, color: "blue" },
                      { plan: "Pro", price: "R$149/mês", areas: 20, diag: 100, color: "green" },
                      { plan: "Enterprise", price: "R$499/mês", areas: 999, diag: 999, color: "purple" },
                    ].map(p => (
                      <div key={p.plan} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all">
                        <div>
                          <p className={`font-bold text-${p.color}-700`}>{p.plan}</p>
                          <p className="text-xs text-gray-500">
                            {p.areas === 999 ? "Áreas ilimitadas" : `${p.areas} áreas`} · {p.diag === 999 ? "diagnósticos ilimitados" : `${p.diag} diagnósticos`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-sm">{p.price}</p>
                          <button className="text-xs text-green-600 font-semibold hover:underline">
                            Fazer upgrade →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Carteira FARMCOIN */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-green-600" />
                  Carteira FARMCOIN (Polygon)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500">
                  Sua carteira recebe os FARMCOINs emitidos pela sua produção diretamente na blockchain Polygon.
                </p>

                {walletMsg && (
                  <div className={`flex items-start gap-2 px-4 py-3 rounded-xl text-sm border ${
                    walletMsg.type === "success"
                      ? "bg-green-50 text-green-700 border-green-100"
                      : "bg-red-50 text-red-600 border-red-100"
                  }`}>
                    {walletMsg.type === "success"
                      ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                      : <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />}
                    {walletMsg.text}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Endereço da carteira
                  </label>
                  <input
                    type="text"
                    value={wallet}
                    onChange={e => setWallet(e.target.value)}
                    placeholder="0x..."
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
                  />
                  <p className="text-xs text-gray-400">
                    Começa com 0x, 42 caracteres (ex: 0xAb12...cD34)
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <a
                    href="https://metamask.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:underline flex items-center gap-1"
                  >
                    Não tem carteira? Crie grátis no MetaMask
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={saveWallet}
                    disabled={walletSaving || !wallet}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl disabled:opacity-50 transition-colors"
                  >
                    {walletSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</> : "Salvar Carteira"}
                  </button>
                </div>

                {user?.walletAddress && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-green-700 font-semibold">Carteira registrada</p>
                      <p className="text-xs font-mono text-green-600 truncate">{user.walletAddress}</p>
                    </div>
                    <a
                      href={`https://polygonscan.com/address/${user.walletAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto shrink-0"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-green-500 hover:text-green-700" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader><CardTitle>Segurança</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Alterar senha</p>
                      <p className="text-xs text-gray-400">Atualize sua senha de acesso</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-600 font-semibold">→</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Notificações</p>
                      <p className="text-xs text-gray-400">Alertas de diagnóstico e comunidade</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-600 font-semibold">→</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
