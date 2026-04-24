"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Leaf, Eye, EyeOff, AlertCircle, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authService } from "@/services/auth.service"
import { useLang } from "@/hooks/useLang"

const T = {
  pt: {
    title: "Entrar na sua conta",
    subtitle: "Bem-vindo de volta, produtor!",
    email: "E-mail",
    password: "Senha",
    passwordPlaceholder: "Sua senha",
    submit: "Entrar",
    noAccount: "Não tem conta?",
    register: "Cadastre-se grátis",
    back: "← Voltar ao início",
    errRequired: "Preencha e-mail e senha.",
    errInvalid: "E-mail ou senha inválidos.",
  },
  en: {
    title: "Sign in to your account",
    subtitle: "Welcome back, farmer!",
    email: "Email",
    password: "Password",
    passwordPlaceholder: "Your password",
    submit: "Sign in",
    noAccount: "Don't have an account?",
    register: "Sign up for free",
    back: "← Back to home",
    errRequired: "Please enter your email and password.",
    errInvalid: "Invalid email or password.",
  },
}

export default function LoginPage() {
  const router = useRouter()
  const { lang, setLang } = useLang()
  const t = T[lang]
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setError(t.errRequired); return }
    setLoading(true)
    setError("")
    try {
      await authService.login(email.toLowerCase().trim(), password)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err?.response?.data?.error ?? t.errInvalid)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo + lang toggle */}
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
          <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
          <p className="text-gray-500 text-sm mt-1">{t.subtitle}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 border border-red-100">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.email}</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-900"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t.password}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="w-full h-11 px-4 pr-11 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-gray-900"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-base" loading={loading}>
              {t.submit}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {t.noAccount}{" "}
            <Link href="/register" className="text-green-600 font-bold hover:underline">
              {t.register}
            </Link>
          </p>

        </div>

        <p className="text-center mt-5">
          <Link href="/" className="text-sm text-gray-500 hover:text-green-600 transition-colors">
            {t.back}
          </Link>
        </p>
      </div>
    </div>
  )
}
