"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Leaf, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api"

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planParam = searchParams.get("plan") // CAMPO ou FAZENDA
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", state: "", role: "PRODUCER" })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { setError("Nome, e-mail e senha são obrigatórios."); return }
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
      setError(err?.response?.data?.error ?? "Erro ao criar conta.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black"><span className="text-gray-900">Sol</span><span className="text-green-600">Farm</span></span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {planParam ? `Criar conta — Plano ${planParam === "CAMPO" ? "Campo" : "Fazenda"}` : "Criar conta grátis"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {planParam
              ? "Crie sua conta e escolha a forma de pagamento logo em seguida"
              : "1 área gratuita para sempre · Atualize quando quiser"}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 border border-red-100">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Você é:</label>
              <div className="grid grid-cols-2 gap-3">
                {[["PRODUCER","🌱","Produtor Rural"],["SUPPLIER","🏪","Fornecedor"]].map(([val, emoji, label]) => (
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nome completo *</label>
              <input value={form.name} onChange={set("name")} placeholder="João da Silva"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">E-mail *</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="seu@email.com.br"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">WhatsApp</label>
                <input value={form.phone} onChange={set("phone")} placeholder="(65) 99999-9999"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Estado (UF)</label>
                <input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value.toUpperCase().slice(0, 2) }))}
                  placeholder="MT" maxLength={2}
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900 uppercase" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Senha *</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={set("password")}
                  placeholder="Mín. 8 caracteres, 1 maiúscula e 1 número"
                  className="w-full h-11 px-4 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base" loading={loading}>
              {planParam ? `Criar conta e ir para pagamento` : "Criar conta grátis"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem conta?{" "}
            <Link href="/login" className="text-green-600 font-bold hover:underline">Entrar</Link>
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
        <div className="text-green-600 text-lg font-semibold">Carregando...</div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
