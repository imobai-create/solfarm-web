"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/services/api"
import { authService } from "@/services/auth.service"
import { healthColor, healthBg, cultureEmoji, cultureLabel, formatDate } from "@/lib/utils"
import { Map, Plus, BarChart3, ArrowRight, TrendingUp, Activity, Leaf, AlertTriangle } from "lucide-react"

export default function DashboardPage() {
  const [areas, setAreas] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(authService.getStoredUser())
    Promise.all([
      api.get("/areas?limit=5").catch(() => ({ data: { data: [] } })),
      api.get("/areas/stats").catch(() => ({ data: {} })),
    ]).then(([areasRes, statsRes]) => {
      setAreas(areasRes.data.data ?? [])
      setStats(statsRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const firstName = user?.name?.split(" ")[0] ?? "Produtor"

  return (
    <div className="min-h-screen">
      <Header title="" />

      <div className="p-8">
        {/* Boas-vindas */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">
            Olá, {firstName}! 🌿
          </h1>
          <p className="text-gray-500 mt-1">Veja o estado atual das suas lavouras</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            { icon: Map, label: "Áreas cadastradas", value: stats?.totalAreas ?? 0, sub: "propriedades", color: "green" },
            { icon: Leaf, label: "Hectares monitorados", value: stats?.totalHectares?.toFixed(0) ?? 0, sub: "ha no total", color: "emerald" },
            { icon: Activity, label: "Diagnósticos realizados", value: stats?.diagnosticsRun ?? 0, sub: "análises", color: "blue" },
            { icon: TrendingUp, label: "Plano atual", value: user?.plan ?? "FREE", sub: "acesso", color: "amber" },
          ].map(({ icon: Icon, label, value, sub, color }) => (
            <Card key={label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 text-${color}-600`} />
                  </div>
                </div>
                <p className="text-2xl font-black text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Áreas recentes */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Suas Áreas</h2>
              <Link href="/dashboard/areas">
                <Button variant="ghost" size="sm" className="gap-1">Ver todas <ArrowRight className="w-4 h-4" /></Button>
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <div key={i} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />)}
              </div>
            ) : areas.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-200">
                <CardContent className="p-10 text-center">
                  <div className="text-5xl mb-4">🗺️</div>
                  <h3 className="font-bold text-gray-900 mb-2">Nenhuma área cadastrada</h3>
                  <p className="text-sm text-gray-500 mb-5">Cadastre sua primeira lavoura para começar o diagnóstico via satélite</p>
                  <Link href="/dashboard/areas">
                    <Button className="gap-2"><Plus className="w-4 h-4" /> Cadastrar área</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {areas.map((area: any) => {
                  const health = area.latestDiagnostic?.healthStatus
                  const score = area.latestDiagnostic?.score
                  return (
                    <Link key={area.id} href={`/dashboard/areas/${area.id}`}>
                      <Card className="hover:shadow-md hover:border-green-200 transition-all cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <span className="text-3xl">{cultureEmoji(area.culture)}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <h3 className="font-bold text-gray-900 truncate">{area.name}</h3>
                              </div>
                              <p className="text-sm text-gray-500">{area.hectares} ha · {cultureLabel(area.culture)}</p>
                              {area.city && <p className="text-xs text-gray-400">📍 {area.city}, {area.state}</p>}
                            </div>
                            <div className="text-right">
                              {health ? (
                                <>
                                  <p className="text-2xl font-black" style={{ color: healthColor(health) }}>{score?.toFixed(1)}</p>
                                  <p className="text-xs text-gray-400">/10</p>
                                  <div className="mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: healthBg(health), color: healthColor(health) }}>
                                    {health.replace("_", " ")}
                                  </div>
                                </>
                              ) : (
                                <div className="text-right">
                                  <div className="inline-block px-3 py-1.5 rounded-xl bg-green-50 text-green-700 text-xs font-bold">
                                    Analisar →
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
                <Link href="/dashboard/areas">
                  <Button variant="outline" className="w-full gap-2 mt-2"><Plus className="w-4 h-4" /> Adicionar área</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Ações rápidas + Plano */}
          <div className="space-y-5">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {[
                  { href: "/dashboard/areas", icon: "🗺️", label: "Ver minhas áreas" },
                  { href: "/dashboard/diagnostics", icon: "📊", label: "Ver diagnósticos" },
                  { href: "/dashboard/marketplace", icon: "🛒", label: "Acessar marketplace" },
                  { href: "/dashboard/community", icon: "👥", label: "Ver comunidade" },
                ].map(({ href, icon, label }) => (
                  <Link key={href} href={href}>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                      <span className="text-xl">{icon}</span>
                      <span className="text-sm font-medium text-gray-700">{label}</span>
                      <ArrowRight className="w-4 h-4 text-gray-300 ml-auto" />
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Plano */}
            {user?.plan === "FREE" && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <p className="text-sm font-bold text-amber-800">Plano Grátis</p>
                  </div>
                  <p className="text-xs text-amber-700 mb-4">Você tem 1 área e diagnóstico básico. Faça upgrade para desbloquear mais recursos.</p>
                  <Button size="sm" variant="warning" className="w-full">
                    🚀 Fazer upgrade — R$49/mês
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
