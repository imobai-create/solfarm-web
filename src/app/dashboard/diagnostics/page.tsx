"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api"
import { healthColor, healthBg, cultureEmoji, cultureLabel, formatDate } from "@/lib/utils"
import { useLang } from "@/hooks/useLang"
import { BarChart3, ArrowRight, Leaf, Droplets, TrendingUp, Search } from "lucide-react"

const T = {
  pt: {
    title: "Diagnósticos",
    headerTitle: "Diagnósticos",
    analysisCount: (n: number) => `${n} análise${n !== 1 ? "s" : ""} realizadas`,
    searchPlaceholder: "Buscar por área ou status...",
    noResults: "Nenhum resultado",
    noDiagnosticYet: "Nenhum diagnóstico ainda",
    noResultsDesc: (search: string) => `Nenhum diagnóstico corresponde a "${search}"`,
    noDiagnosticDesc: "Acesse uma área e inicie uma análise via satélite",
    viewMyAreas: "Ver minhas áreas",
  },
  en: {
    title: "Diagnostics",
    headerTitle: "Diagnostics",
    analysisCount: (n: number) => `${n} analysis${n !== 1 ? "es" : ""} performed`,
    searchPlaceholder: "Search by area or status...",
    noResults: "No results",
    noDiagnosticYet: "No diagnostics yet",
    noResultsDesc: (search: string) => `No diagnostic matches "${search}"`,
    noDiagnosticDesc: "Go to an area and start a satellite analysis",
    viewMyAreas: "View my areas",
  },
}

function ndviColor(v: number): string {
  if (v >= 0.7) return "#16a34a"
  if (v >= 0.5) return "#4ade80"
  if (v >= 0.3) return "#facc15"
  if (v >= 0.1) return "#f97316"
  return "#ef4444"
}

export default function DiagnosticsPage() {
  const { lang } = useLang()
  const t = T[lang]

  const [diagnostics, setDiagnostics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    api.get("/diagnostics")
      .then(res => setDiagnostics(res.data.diagnostics ?? res.data.data ?? res.data ?? []))
      .catch(() => setDiagnostics([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = diagnostics.filter(d =>
    d.area?.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.healthStatus?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen">
      <Header title={t.headerTitle} />

      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">{t.title}</h1>
            <p className="text-gray-500 text-sm mt-0.5">{t.analysisCount(diagnostics.length)}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-200">
            <CardContent className="p-16 text-center">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">
                {search ? t.noResults : t.noDiagnosticYet}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {search ? t.noResultsDesc(search) : t.noDiagnosticDesc}
              </p>
              {!search && (
                <Link href="/dashboard/areas">
                  <Button className="gap-2">{t.viewMyAreas}</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map((d: any) => (
              <Link key={d.id} href={`/dashboard/diagnostics/${d.id}`}>
                <Card className="hover:shadow-md hover:border-green-200 transition-all cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-5">
                      {/* Culture emoji */}
                      <span className="text-4xl flex-shrink-0">{cultureEmoji(d.area?.culture)}</span>

                      {/* Area info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 truncate">{d.area?.name ?? "Área"}</h3>
                          <div
                            className="px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0"
                            style={{ backgroundColor: healthBg(d.healthStatus), color: healthColor(d.healthStatus) }}
                          >
                            {d.healthStatus?.replace("_", " ")}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {cultureLabel(d.area?.culture)} · {d.area?.hectares} ha
                          {d.area?.city ? ` · ${d.area.city}, ${d.area.state}` : ""}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">📅 {formatDate(d.createdAt)}</p>
                      </div>

                      {/* Score */}
                      <div className="text-center flex-shrink-0">
                        <p className="text-3xl font-black" style={{ color: healthColor(d.healthStatus) }}>
                          {d.score?.toFixed(1)}
                        </p>
                        <p className="text-xs text-gray-400">/10</p>
                      </div>

                      {/* Indices */}
                      <div className="hidden md:flex gap-4 flex-shrink-0">
                        {[
                          { icon: Leaf, label: "NDVI", value: d.satelliteImage?.ndviMean },
                          { icon: TrendingUp, label: "NDRE", value: d.satelliteImage?.ndreMean },
                          { icon: Droplets, label: "NDWI", value: d.satelliteImage?.ndwiMean },
                        ].map(({ icon: Icon, label, value }) => (
                          <div key={label} className="text-center">
                            <Icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: ndviColor(value ?? 0) }} />
                            <p className="text-sm font-bold" style={{ color: ndviColor(value ?? 0) }}>
                              {value?.toFixed(2) ?? "—"}
                            </p>
                            <p className="text-xs text-gray-400">{label}</p>
                          </div>
                        ))}
                      </div>

                      <ArrowRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
