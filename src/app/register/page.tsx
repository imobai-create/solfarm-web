"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Leaf, Eye, EyeOff, AlertCircle, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api"
import { useLang } from "@/hooks/useLang"

const T = {
  pt: {
    titleFree: "Criar conta grátis",
    titlePlan: (plan: string) => `Criar conta — Plano ${plan === "CAMPO" ? "Campo" : "Fazenda"}`,
    subtitleFree: "1 área gratuita para sempre · Atualize quando quiser",
    subtitlePlan: "Crie sua conta e escolha a forma de pagamento logo em seguida",
    youAre: "Você é:",
    producer: "Produtor Rural",
    supplier: "Fornecedor",
    name: "Nome completo *",
    namePlaceholder: "João da Silva",
    email: "E-mail *",
    whatsapp: "WhatsApp",
    whatsappPlaceholder: "(65) 99999-9999",
    state: "Estado (UF)",
    statePlaceholder: "MT",
    password: "Senha *",
    passwordPlaceholder: "Mín. 8 caracteres, 1 maiúscula e 1 número",
    submitFree: "Criar conta grátis",
    submitPlan: "Criar conta e ir para pagamento",
    hasAccount: "Já tem conta?",
    login: "Entrar",
    errRequired: "Nome, e-mail e senha são obrigatórios.",
    errCreate: "Erro ao criar conta.",
    loading: "Carregando...",
  },
  en: {
    titleFree: "Create free account",
    titlePlan: (plan: string) => `Sign up — ${plan === "CAMPO" ? "Field" : "Farm"} Plan`,
    subtitleFree: "1 free field forever · Upgrade anytime",
    subtitlePlan: "Create your account, then choose your payment method",
    youAre: "I am a:",
    producer: "Rural Producer",
    supplier: "Supplier",
    name: "Full name *",
    namePlaceholder: "John Smith",
    email: "Email *",
    whatsapp: "WhatsApp / Phone",
    whatsappPlaceholder: "+1 555 0000",
    state: "State / Region",
    statePlaceholder: "CA",
    password: "Password *",
    passwordPlaceholder: "Min. 8 chars, 1 uppercase and 1 number",
    submitFree: "Create free account",
    submitPlan: "Create account & go to payment",
    hasAccount: "Already have an account?",
    login: "Sign in",
    errRequired: "Name, email and password are required.",
    errCreate: "Failed to create account.",
    loading: "Loading...",
  },
}

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planParam = searchParams.get("plan") as "CAMPO" | "FAZENDA" | null
  const { lang, setLang } = useLang()
  const t = T[lang]

  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", state: "", role: "PRODUCER" })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { setError(t.errRequired); return }
    setLoading(true)
    setError("")
    try {
      const res = await api.post("/auth/register", { ...form, email: form.email.toLowerCase() })
      localStorage.setItem("solfarm_token", res.data.accessToken)
      localStorage.setItem("solfarm_refresh", res.data.refreshToken)
      localStorage.setItem("solfarm_user", JSON.stringify(res.data.user))
      if (planParam === "CAMPO" || planParam === "FAZENDA") {
        router.push(`/dashboard/upgrade?plan=${planParam}`)
      } else {
        router.push("/dashboard")
      }
    } catch (err: any) {
      setError(err?.response?.data?.error ?? t.errCreate)
    } finally {
      setLoading(false)
    }
  }

  const planLabel = planParam
    ? (lang === "pt"
        ? (planParam === "CAMPO" ? "Campo" : "Fazenda")
        : (planParam === "CAMPO" ? "Field" : "Farm"))
    : ""

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black">
              <span className="text-gray-900">Sol</span>
              <span className="text-green-600">Farm</span>
            </span>
            <button
              onClick={() => setLang(lang === "pt" ? "en" : "pt")}
              className="ml-2 flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
            >
              <Globe className="w-3 h-3" />
              {lang === "pt" ? "EN" : "PT"}
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {planParam ? t.titlePlan(planParam) : t.titleFree}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {planParam ? t.subtitlePlan : t.subtitleFree}
          </p>
          {planParam && (
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-bold">
              ✨ {lang === "pt" ? "Plano" : "Plan"} {planLabel}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 border border-red-100">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">{t.youAre}</label>
              <div className="grid grid-cols-2 gap-3">
                {([["PRODUCER","🌱", t.producer],["SUPPLIER","🏪", t.supplier]] as [string,string,string][]).map(([val, emoji, label]) => (
                  <button key={val} type="button"
                    onClick={() => setForm(f => ({ ...f, role: val }))}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition-all ${form.role === val ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                  >
                    <span>{emoji}</span> {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.name}</label>
              <input value={form.name} onChange={set("name")} placeholder={t.namePlaceholder}
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.email}</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.whatsapp}</label>
                <input value={form.phone} onChange={set("phone")} placeholder={t.whatsappPlaceholder}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.state}</label>
                <input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value.toUpperCase().slice(0, 2) }))}
                  placeholder={t.statePlaceholder} maxLength={2}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900 uppercase" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.password}</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={set("password")}
                  placeholder={t.passwordPlaceholder}
                  className="w-full h-11 px-4 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base" loading={loading}>
              {planParam ? t.submitPlan : t.submitFree}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {t.hasAccount}{" "}
            <Link href="/login" className="text-green-600 font-bold hover:underline">{t.login}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-green-600 text-lg font-semibold">Loading...</div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
