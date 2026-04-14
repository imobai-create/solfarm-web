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
import { useLang } from "@/hooks/useLang"
import { User, Mail, Phone, MapPin, Shield, Bell, LogOut, AlertCircle, CheckCircle2, Zap, Wallet, ExternalLink, Loader2 } from "lucide-react"

const T = {
  pt: {
    pageTitle: "Perfil",
    heading: "Minha Conta",
    subtitle: "Gerencie seu perfil e assinatura",
    profileSaved: "Perfil atualizado com sucesso!",
    planLabel: "Plano",
    producer: "🌱 Produtor Rural",
    supplier: "🏪 Fornecedor",
    planUsage: "Uso do plano",
    registeredAreas: "Áreas cadastradas",
    diagnosticsRun: "Diagnósticos realizados",
    logout: "Sair da conta",
    personalInfo: "Informações pessoais",
    edit: "Editar",
    cancel: "Cancelar",
    save: "Salvar",
    fieldName: "Nome completo",
    fieldEmail: "E-mail",
    fieldPhone: "WhatsApp",
    fieldState: "Estado (UF)",
    subscription: "Assinatura",
    unlimitedAreas: "Áreas ilimitadas",
    upToAreas: (n: number) => `Até ${n} área${n > 1 ? "s" : ""}`,
    unlimitedDiagnostics: "Diagnósticos ilimitados",
    diagnosticsPerMonth: (n: number) => `${n} diagnósticos/mês`,
    upgradeBtn: "Fazer upgrade →",
    walletTitle: "Carteira FARMCOIN (Polygon)",
    walletDesc: "Sua carteira recebe os FARMCOINs emitidos pela sua produção diretamente na blockchain Polygon.",
    walletAddress: "Endereço da carteira",
    walletHint: "Começa com 0x, 42 caracteres (ex: 0xAb12...cD34)",
    walletInvalid: "Endereço inválido. Deve começar com 0x e ter 42 caracteres.",
    walletSuccess: "Carteira registrada! Seus FARMCOINs serão enviados para este endereço.",
    walletError: "Erro ao salvar carteira.",
    walletRegistered: "Carteira registrada",
    noWallet: "Não tem carteira? Crie grátis no MetaMask",
    saveWallet: "Salvar Carteira",
    savingWallet: "Salvando...",
    security: "Segurança",
    changePassword: "Alterar senha",
    changePasswordDesc: "Atualize sua senha de acesso",
    notifications: "Notificações",
    notificationsDesc: "Alertas de diagnóstico e comunidade",
  },
  en: {
    pageTitle: "Profile",
    heading: "My Account",
    subtitle: "Manage your profile and subscription",
    profileSaved: "Profile updated successfully!",
    planLabel: "Plan",
    producer: "🌱 Rural Producer",
    supplier: "🏪 Supplier",
    planUsage: "Plan usage",
    registeredAreas: "Registered areas",
    diagnosticsRun: "Diagnostics run",
    logout: "Sign out",
    personalInfo: "Personal information",
    edit: "Edit",
    cancel: "Cancel",
    save: "Save",
    fieldName: "Full name",
    fieldEmail: "E-mail",
    fieldPhone: "WhatsApp",
    fieldState: "State (UF)",
    subscription: "Subscription",
    unlimitedAreas: "Unlimited areas",
    upToAreas: (n: number) => `Up to ${n} area${n > 1 ? "s" : ""}`,
    unlimitedDiagnostics: "Unlimited diagnostics",
    diagnosticsPerMonth: (n: number) => `${n} diagnostics/month`,
    upgradeBtn: "Upgrade →",
    walletTitle: "FARMCOIN Wallet (Polygon)",
    walletDesc: "Your wallet receives FARMCOINs issued by your production directly on the Polygon blockchain.",
    walletAddress: "Wallet address",
    walletHint: "Starts with 0x, 42 characters (e.g. 0xAb12...cD34)",
    walletInvalid: "Invalid address. Must start with 0x and have 42 characters.",
    walletSuccess: "Wallet registered! Your FARMCOINs will be sent to this address.",
    walletError: "Failed to save wallet.",
    walletRegistered: "Wallet registered",
    noWallet: "No wallet? Create one free on MetaMask",
    saveWallet: "Save Wallet",
    savingWallet: "Saving...",
    security: "Security",
    changePassword: "Change password",
    changePasswordDesc: "Update your access password",
    notifications: "Notifications",
    notificationsDesc: "Diagnostic and community alerts",
  },
}

const PLAN_LIMITS: Record<string, any> = {
  FREE:       { areas: 1,   diagnostics: 3,   name: "Grátis",    color: "text-gray-600",   bg: "bg-gray-100" },
  CAMPO:      { areas: 5,   diagnostics: 20,  name: "Campo",     color: "text-blue-600",   bg: "bg-blue-50" },
  FAZENDA:    { areas: 999, diagnostics: 999, name: "Fazenda",   color: "text-green-600",  bg: "bg-green-50" },
  STARTER:    { areas: 5,   diagnostics: 20,  name: "Starter",   color: "text-blue-600",   bg: "bg-blue-50" },
  PRO:        { areas: 20,  diagnostics: 100, name: "Pro",       color: "text-green-600",  bg: "bg-green-50" },
  ENTERPRISE: { areas: 999, diagnostics: 999, name: "Enterprise",color: "text-purple-600", bg: "bg-purple-50" },
}

export default function ProfilePage() {
  const { lang } = useLang()
  const t = T[lang]
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
      await api.patch("/auth/me", form)
      const updated = { ...user, ...form }
      localStorage.setItem("solfarm_user", JSON.stringify(updated))
      setUser(updated)
      setEditing(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  async function saveWallet() {
    if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      setWalletMsg({ type: "error", text: t.walletInvalid })
      return
    }
    setWalletSaving(true)
    setWalletMsg(null)
    try {
      await api.patch("/auth/wallet", { walletAddress: wallet })
      const updated = { ...user, walletAddress: wallet }
      localStorage.setItem("solfarm_user", JSON.stringify(updated))
      setUser(updated)
      setWalletMsg({ type: "success", text: t.walletSuccess })
    } catch (err: any) {
      setWalletMsg({ type: "error", text: err?.response?.data?.error ?? t.walletError })
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

  const fields = [
    { icon: User,   label: t.fieldName,  key: "name",  value: user.name,  type: "text" },
    { icon: Mail,   label: t.fieldEmail, key: "email", value: user.email, type: "email", readOnly: true },
    { icon: Phone,  label: t.fieldPhone, key: "phone", value: user.phone, type: "tel" },
    { icon: MapPin, label: t.fieldState, key: "state", value: user.state, type: "text" },
  ]

  const upgradePlans = [
    { plan: "Starter", price: "R$49/mês", areas: 5,   diag: 20,  color: "blue" },
    { plan: "Pro",     price: "R$149/mês", areas: 20,  diag: 100, color: "green" },
    { plan: "Enterprise", price: "R$499/mês", areas: 999, diag: 999, color: "purple" },
  ]

  return (
    <div className="min-h-screen">
      <Header title={t.pageTitle} />

      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">{t.heading}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{t.subtitle}</p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-5 border border-green-100">
            <CheckCircle2 className="w-4 h-4" /> {t.profileSaved}
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
                    {t.planLabel} {plan.name}
                  </span>
                </div>
                {user.role && (
                  <p className="text-xs text-gray-400 mt-2">
                    {user.role === "PRODUCER" ? t.producer : t.supplier}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Usage */}
            <Card>
              <CardHeader><CardTitle className="text-base">{t.planUsage}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-500">{t.registeredAreas}</span>
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
                    <span className="text-gray-500">{t.diagnosticsRun}</span>
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
                  <LogOut className="w-4 h-4" /> {t.logout}
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
                  <CardTitle>{t.personalInfo}</CardTitle>
                  {!editing ? (
                    <Button variant="outline" size="sm" onClick={() => setEditing(true)}>{t.edit}</Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditing(false)}>{t.cancel}</Button>
                      <Button size="sm" onClick={saveProfile} loading={saving}>{t.save}</Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map(({ icon: Icon, label, key, value, type, readOnly }) => (
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
              <CardHeader><CardTitle>{t.subscription}</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 mb-5">
                  <div>
                    <p className="font-bold text-gray-900">{t.planLabel} {plan.name}</p>
                    <p className="text-sm text-gray-500">
                      {plan.areas === 999 ? t.unlimitedAreas : t.upToAreas(plan.areas)} ·{" "}
                      {plan.diagnostics === 999 ? t.unlimitedDiagnostics : t.diagnosticsPerMonth(plan.diagnostics)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${plan.bg} ${plan.color}`}>
                    {user.plan ?? "FREE"}
                  </span>
                </div>

                {user.plan === "FREE" && (
                  <div className="space-y-3">
                    {upgradePlans.map(p => (
                      <div key={p.plan} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all">
                        <div>
                          <p className={`font-bold text-${p.color}-700`}>{p.plan}</p>
                          <p className="text-xs text-gray-500">
                            {p.areas === 999 ? t.unlimitedAreas : `${p.areas} ${lang === "pt" ? "áreas" : "areas"}`} · {p.diag === 999 ? t.unlimitedDiagnostics : `${p.diag} ${lang === "pt" ? "diagnósticos" : "diagnostics"}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-sm">{p.price}</p>
                          <button className="text-xs text-green-600 font-semibold hover:underline">
                            {t.upgradeBtn}
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
                  {t.walletTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-500">{t.walletDesc}</p>

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
                    {t.walletAddress}
                  </label>
                  <input
                    type="text"
                    value={wallet}
                    onChange={e => setWallet(e.target.value)}
                    placeholder="0x..."
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
                  />
                  <p className="text-xs text-gray-400">{t.walletHint}</p>
                </div>

                <div className="flex items-center justify-between">
                  <a
                    href="https://metamask.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:underline flex items-center gap-1"
                  >
                    {t.noWallet}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={saveWallet}
                    disabled={walletSaving || !wallet}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl disabled:opacity-50 transition-colors"
                  >
                    {walletSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> {t.savingWallet}</> : t.saveWallet}
                  </button>
                </div>

                {user?.walletAddress && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-green-700 font-semibold">{t.walletRegistered}</p>
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
              <CardHeader><CardTitle>{t.security}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{t.changePassword}</p>
                      <p className="text-xs text-gray-400">{t.changePasswordDesc}</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-600 font-semibold">→</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <Bell className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">{t.notifications}</p>
                      <p className="text-xs text-gray-400">{t.notificationsDesc}</p>
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
