"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api"
import { useLang } from "@/hooks/useLang"
import { cultureEmoji, cultureLabel, formatDate } from "@/lib/utils"
import { Satellite, ArrowRight, Cloud, CheckCircle2, Clock, Loader2, Globe2 } from "lucide-react"

const T = {
  pt: {
    pageTitle: "Satélite",
    heading: "Análise via Satélite",
    subtitle: "Processamento de imagens Sentinel-2 L2A em tempo real",
    bannerTitle: "Sentinel-2 L2A — Fonte: ESA / Element84",
    bannerDesc: "Imagens de satélite gratuitas com resolução de 10m/pixel, atualizadas a cada 5 dias. Processamos as bandas espectrais para calcular NDVI, NDRE e NDWI da sua lavoura.",
    badgeResolution: "Resolução",
    badgeRevisit: "Revisita",
    badgeBands: "Bandas",
    badgeCost: "Custo",
    badgeResolutionVal: "10m/px",
    badgeRevisitVal: "5 dias",
    badgeBandsVal: "13 bandas",
    badgeCostVal: "Gratuito",
    steps: [
      { step: "1", icon: "🛰️", title: "Busca STAC", desc: "Pesquisamos imagens recentes da sua área via Earth Search API" },
      { step: "2", icon: "📡", title: "Leitura COG", desc: "Lemos as bandas do Cloud Optimized GeoTIFF remotamente" },
      { step: "3", icon: "🔬", title: "Cálculo índices", desc: "Calculamos NDVI, NDRE e NDWI pixel a pixel" },
      { step: "4", icon: "🤖", title: "Diagnóstico IA", desc: "Geramos recomendações e plano de adubação VRA" },
    ],
    analyzeAreas: "Analisar suas áreas",
    noAreasTitle: "Nenhuma área cadastrada",
    noAreasDesc: "Cadastre sua primeira lavoura para analisar via satélite",
    registerArea: "Cadastrar área",
    lastAnalysis: "Última análise:",
    done: "Concluído!",
    analyzing: "Analisando...",
    analyze: "Analisar",
    viewArea: "Ver área",
    processing: "Processando imagens Sentinel-2...",
  },
  en: {
    pageTitle: "Satellite",
    heading: "Satellite Analysis",
    subtitle: "Sentinel-2 L2A image processing in real time",
    bannerTitle: "Sentinel-2 L2A — Source: ESA / Element84",
    bannerDesc: "Free satellite imagery with 10m/pixel resolution, updated every 5 days. We process spectral bands to calculate NDVI, NDRE and NDWI for your fields.",
    badgeResolution: "Resolution",
    badgeRevisit: "Revisit",
    badgeBands: "Bands",
    badgeCost: "Cost",
    badgeResolutionVal: "10m/px",
    badgeRevisitVal: "5 days",
    badgeBandsVal: "13 bands",
    badgeCostVal: "Free",
    steps: [
      { step: "1", icon: "🛰️", title: "STAC Search", desc: "We search for recent images of your area via Earth Search API" },
      { step: "2", icon: "📡", title: "COG Read", desc: "We read the Cloud Optimized GeoTIFF bands remotely" },
      { step: "3", icon: "🔬", title: "Index calculation", desc: "We calculate NDVI, NDRE and NDWI pixel by pixel" },
      { step: "4", icon: "🤖", title: "AI Diagnostic", desc: "We generate recommendations and a VRA fertilization plan" },
    ],
    analyzeAreas: "Analyze your areas",
    noAreasTitle: "No areas registered",
    noAreasDesc: "Register your first field to analyze via satellite",
    registerArea: "Register area",
    lastAnalysis: "Last analysis:",
    done: "Done!",
    analyzing: "Analyzing...",
    analyze: "Analyze",
    viewArea: "View area",
    processing: "Processing Sentinel-2 images...",
  },
}

function ndviColor(v: number): string {
  if (v >= 0.7) return "#16a34a"
  if (v >= 0.5) return "#4ade80"
  if (v >= 0.3) return "#facc15"
  if (v >= 0.1) return "#f97316"
  return "#ef4444"
}

export default function SatellitePage() {
  const { lang } = useLang()
  const t = T[lang]

  const [areas, setAreas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState<string | null>(null)
  const [done, setDone] = useState<string[]>([])

  useEffect(() => {
    api.get("/areas?limit=20")
      .then(res => setAreas(res.data.data ?? []))
      .catch(() => setAreas([]))
      .finally(() => setLoading(false))
  }, [])

  async function analyze(areaId: string) {
    setRunning(areaId)
    try {
      const imgRes = await api.post(`/areas/${areaId}/satellite/search`)
      const imageId = imgRes.data?.id ?? imgRes.data?.imageId
      if (imageId) {
        await api.post(`/satellite/process/${imageId}`)
      }
      await api.post(`/areas/${areaId}/diagnostic`)
      setDone(d => [...d, areaId])
    } catch {
      // fail silently, area page will show error
    } finally {
      setRunning(null)
    }
  }

  const infoBadges = [
    { label: t.badgeResolution, value: t.badgeResolutionVal },
    { label: t.badgeRevisit,    value: t.badgeRevisitVal },
    { label: t.badgeBands,      value: t.badgeBandsVal },
    { label: t.badgeCost,       value: t.badgeCostVal },
  ]

  return (
    <div className="min-h-screen">
      <Header title={t.pageTitle} />

      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">{t.heading}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{t.subtitle}</p>
        </div>

        {/* Info banner */}
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Globe2 className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900 mb-1.5">{t.bannerTitle}</h3>
                <p className="text-sm text-blue-700 mb-3">{t.bannerDesc}</p>
                <div className="flex flex-wrap gap-3">
                  {infoBadges.map(({ label, value }) => (
                    <div key={label} className="px-3 py-1.5 rounded-lg bg-white border border-blue-100">
                      <span className="text-xs text-blue-500 font-medium">{label}: </span>
                      <span className="text-xs text-blue-800 font-bold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How it works */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {t.steps.map(({ step, icon, title, desc }) => (
            <Card key={step}>
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{icon}</div>
                <div className="w-6 h-6 rounded-full bg-green-600 text-white text-xs font-black flex items-center justify-center mx-auto mb-2">
                  {step}
                </div>
                <p className="font-bold text-gray-900 text-sm mb-1">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Areas to analyze */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">{t.analyzeAreas}</h2>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />)}
            </div>
          ) : areas.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-200">
              <CardContent className="p-12 text-center">
                <Satellite className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">{t.noAreasTitle}</h3>
                <p className="text-sm text-gray-500 mb-5">{t.noAreasDesc}</p>
                <Link href="/dashboard/areas/new">
                  <Button>{t.registerArea}</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {areas.map((area: any) => {
                const isRunning = running === area.id
                const isDone = done.includes(area.id)
                const ndvi = area.latestDiagnostic?.ndvi

                return (
                  <Card key={area.id} className={isDone ? "border-green-200 bg-green-50" : ""}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-4">
                        <span className="text-4xl">{cultureEmoji(area.culture)}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900">{area.name}</h3>
                          <p className="text-sm text-gray-500">
                            {cultureLabel(area.culture)} · {area.hectares} ha
                            {area.city ? ` · ${area.city}, ${area.state}` : ""}
                          </p>
                          {area.latestDiagnostic && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {t.lastAnalysis} {formatDate(area.latestDiagnostic.createdAt)}
                              {ndvi !== null && ndvi !== undefined && (
                                <span className="ml-2 font-bold" style={{ color: ndviColor(ndvi) }}>
                                  NDVI {ndvi.toFixed(3)}
                                </span>
                              )}
                            </p>
                          )}
                        </div>

                        {/* Status / Action */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {isDone ? (
                            <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                              <CheckCircle2 className="w-5 h-5" />
                              {t.done}
                            </div>
                          ) : isRunning ? (
                            <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              {t.analyzing}
                            </div>
                          ) : (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() => analyze(area.id)}
                                disabled={!!running}
                              >
                                <Satellite className="w-4 h-4" />
                                {t.analyze}
                              </Button>
                              <Link href={`/dashboard/areas/${area.id}`}>
                                <Button variant="ghost" size="sm" className="gap-1">
                                  {t.viewArea} <ArrowRight className="w-3.5 h-3.5" />
                                </Button>
                              </Link>
                            </>
                          )}
                        </div>
                      </div>

                      {isRunning && (
                        <div className="mt-4 space-y-2">
                          <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full animate-pulse w-3/4" />
                          </div>
                          <p className="text-xs text-blue-500">{t.processing}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
