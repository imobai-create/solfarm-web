"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api"
import { healthColor, healthBg, cultureEmoji, cultureLabel, formatDate } from "@/lib/utils"
import { Plus, Map, Search, ArrowRight, Satellite } from "lucide-react"
import { useLang } from "@/hooks/useLang"

const T = {
  pt: {
    headerTitle: "Minhas Áreas",
    pageTitle: "Suas Lavouras",
    areaCount: (n: number) => `${n} área${n !== 1 ? "s" : ""} cadastrada${n !== 1 ? "s" : ""}`,
    newArea: "Nova Área",
    searchPlaceholder: "Buscar por nome, cidade ou cultura...",
    emptyTitle: "Cadastre sua primeira área",
    emptySubtitle: "Defina os limites da sua lavoura e comece o diagnóstico via satélite",
    noResultsTitle: "Nenhuma área encontrada",
    noResultsSubtitle: (q: string) => `Nenhuma área corresponde a "${q}"`,
    registerArea: "Cadastrar área",
    hectares: (h: number | string) => `${h} hectares`,
    noDiagnostic: "Sem diagnóstico",
    viewArea: "Ver área",
    addArea: "Adicionar área",
    mapLabel: "Delimite no mapa",
  },
  en: {
    headerTitle: "My Fields",
    pageTitle: "Your Fields",
    areaCount: (n: number) => `${n} field${n !== 1 ? "s" : ""} registered`,
    newArea: "New Field",
    searchPlaceholder: "Search by name, city or crop...",
    emptyTitle: "Register your first field",
    emptySubtitle: "Define your field boundaries and start satellite diagnostics",
    noResultsTitle: "No fields found",
    noResultsSubtitle: (q: string) => `No field matches "${q}"`,
    registerArea: "Register field",
    hectares: (h: number | string) => `${h} hectares`,
    noDiagnostic: "No diagnostic",
    viewArea: "View field",
    addArea: "Add field",
    mapLabel: "Draw on map",
  },
}

export default function AreasPage() {
  const { lang } = useLang()
  const t = T[lang]

  const [areas, setAreas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    api.get("/areas?limit=50")
      .then(res => setAreas(res.data.data ?? []))
      .catch(() => setAreas([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = areas.filter(a =>
    a.name?.toLowerCase().includes(search.toLowerCase()) ||
    a.city?.toLowerCase().includes(search.toLowerCase()) ||
    cultureLabel(a.culture)?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen">
      <Header title={t.headerTitle} />

      <div className="p-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">{t.pageTitle}</h1>
            <p className="text-gray-500 text-sm mt-0.5">{t.areaCount(areas.length)}</p>
          </div>
          <Link href="/dashboard/areas/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> {t.newArea}
            </Button>
          </Link>
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

        {/* Content */}
        {loading ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-200">
            <CardContent className="p-16 text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                {search ? t.noResultsTitle : t.emptyTitle}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {search ? t.noResultsSubtitle(search) : t.emptySubtitle}
              </p>
              {!search && (
                <Link href="/dashboard/areas/new">
                  <Button className="gap-2"><Plus className="w-4 h-4" /> {t.registerArea}</Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((area: any) => {
              const health = area.latestDiagnostic?.healthStatus
              const score = area.latestDiagnostic?.score
              return (
                <Link key={area.id} href={`/dashboard/areas/${area.id}`}>
                  <Card className="hover:shadow-lg hover:border-green-200 transition-all cursor-pointer h-full">
                    <CardContent className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{cultureEmoji(area.culture)}</span>
                          <div>
                            <h3 className="font-bold text-gray-900 leading-tight">{area.name}</h3>
                            <p className="text-sm text-gray-500">{cultureLabel(area.culture)}</p>
                          </div>
                        </div>
                        {health ? (
                          <div className="text-right">
                            <p className="text-2xl font-black" style={{ color: healthColor(health) }}>
                              {score?.toFixed(1)}
                            </p>
                            <p className="text-xs text-gray-400">/10</p>
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                            <Satellite className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Map className="w-3.5 h-3.5 text-gray-400" />
                          <span>{t.hectares(area.hectares)}</span>
                        </div>
                        {area.city && (
                          <p className="text-sm text-gray-500">📍 {area.city}, {area.state}</p>
                        )}
                        {area.biome && (
                          <p className="text-xs text-gray-400">🌿 {area.biome.replace("_", " ")}</p>
                        )}
                      </div>

                      {/* Status */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        {health ? (
                          <div
                            className="px-2.5 py-1 rounded-full text-xs font-bold"
                            style={{ backgroundColor: healthBg(health), color: healthColor(health) }}
                          >
                            {health.replace("_", " ")}
                          </div>
                        ) : (
                          <div className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                            {t.noDiagnostic}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                          {t.viewArea} <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}

            {/* Add card */}
            <Link href="/dashboard/areas/new">
              <Card className="border-dashed border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer h-full">
                <CardContent className="p-5 flex flex-col items-center justify-center h-full min-h-48 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mb-3">
                    <Plus className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="font-bold text-gray-700">{t.addArea}</p>
                  <p className="text-xs text-gray-400 mt-1">{t.mapLabel}</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
