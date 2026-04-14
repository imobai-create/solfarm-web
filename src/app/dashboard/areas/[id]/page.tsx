"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api"
import { healthColor, healthBg, cultureEmoji, cultureLabel, formatDate } from "@/lib/utils"
import { useLang } from "@/hooks/useLang"
import {
  ArrowLeft, Satellite, Activity, BarChart3, Map, Loader2, CheckCircle2,
  AlertTriangle, TrendingUp, Droplets, Leaf, Clock, ArrowRight
} from "lucide-react"

const T = {
  pt: {
    areas: "Áreas",
    newAnalysis: "Nova análise",
    analyzing: "Analisando...",
    analysisInProgress: "Análise em andamento",
    totalArea: "Área total",
    diagnostics: "Diagnósticos",
    lastScore: "Último score",
    lastAnalysis: "Última análise",
    never: "Nunca",
    latestDiagnostic: "Último Diagnóstico",
    viewFull: "Ver completo",
    vegetation: "Vegetação",
    nitrogen: "Nitrogênio",
    water: "Hídrico",
    zoneMap: "Mapa de Zonas (NDVI)",
    zone: "Zona",
    low: "Baixo",
    high: "Alto",
    noDiagnosticYet: "Nenhum diagnóstico ainda",
    noDiagnosticDesc: 'Clique em "Nova análise" para processar imagens Sentinel-2 e obter o diagnóstico completo desta área',
    startSatelliteAnalysis: "Iniciar análise via satélite",
    history: "Histórico",
    noHistory: "Nenhum histórico ainda",
    stepSearching: "Buscando imagem Sentinel-2...",
    stepProcessing: "Processando bandas espectrais (NDVI, NDRE, NDWI)...",
    stepGenerating: "Gerando diagnóstico com IA agrícola...",
    stepDone: "Diagnóstico completo!",
    stepError: "Erro na análise. Tente novamente.",
  },
  en: {
    areas: "Areas",
    newAnalysis: "New analysis",
    analyzing: "Analyzing...",
    analysisInProgress: "Analysis in progress",
    totalArea: "Total area",
    diagnostics: "Diagnostics",
    lastScore: "Latest score",
    lastAnalysis: "Last analysis",
    never: "Never",
    latestDiagnostic: "Latest Diagnostic",
    viewFull: "View full",
    vegetation: "Vegetation",
    nitrogen: "Nitrogen",
    water: "Water",
    zoneMap: "Zone Map (NDVI)",
    zone: "Zone",
    low: "Low",
    high: "High",
    noDiagnosticYet: "No diagnostics yet",
    noDiagnosticDesc: 'Click "New analysis" to process Sentinel-2 imagery and get the full diagnostic for this area',
    startSatelliteAnalysis: "Start satellite analysis",
    history: "History",
    noHistory: "No history yet",
    stepSearching: "Fetching Sentinel-2 image...",
    stepProcessing: "Processing spectral bands (NDVI, NDRE, NDWI)...",
    stepGenerating: "Generating diagnostic with agricultural AI...",
    stepDone: "Diagnostic complete!",
    stepError: "Analysis error. Please try again.",
  },
}

function ndviColor(v: number): string {
  if (v >= 0.7) return "#16a34a"
  if (v >= 0.5) return "#4ade80"
  if (v >= 0.3) return "#facc15"
  if (v >= 0.1) return "#f97316"
  return "#ef4444"
}

export default function AreaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { lang } = useLang()
  const t = T[lang]

  const [area, setArea] = useState<any>(null)
  const [diagnostics, setDiagnostics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeStep, setAnalyzeStep] = useState("")

  useEffect(() => {
    Promise.all([
      api.get(`/areas/${id}`),
      api.get(`/areas/${id}/diagnostics`).catch(() => ({ data: [] })),
    ]).then(([areaRes, diagRes]) => {
      setArea(areaRes.data)
      setDiagnostics(diagRes.data ?? [])
    }).catch(() => router.push("/dashboard/areas"))
    .finally(() => setLoading(false))
  }, [id])

  async function runAnalysis() {
    setAnalyzing(true)
    try {
      setAnalyzeStep("🛰️ " + t.stepSearching)
      const imgRes = await api.post(`/areas/${id}/satellite/search`)
      const imageId = imgRes.data?.id ?? imgRes.data?.imageId

      setAnalyzeStep("📡 " + t.stepProcessing)
      await new Promise(r => setTimeout(r, 2000))

      setAnalyzeStep("🔬 " + t.stepGenerating)
      await api.post(`/satellite/process/${imageId}`)

      const diagRes = await api.post(`/areas/${id}/diagnostic`)
      setAnalyzeStep("✅ " + t.stepDone)
      await new Promise(r => setTimeout(r, 1000))
      router.push(`/dashboard/diagnostics/${diagRes.data.id}`)
    } catch (err: any) {
      setAnalyzeStep("❌ " + (err?.response?.data?.error ?? t.stepError))
      setTimeout(() => { setAnalyzing(false); setAnalyzeStep("") }, 3000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (!area) return null

  const latest = area.latestDiagnostic

  return (
    <div className="min-h-screen">
      <Header title="" />

      <div className="p-8">
        {/* Back + Title */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard/areas">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="w-4 h-4" /> {t.areas}
            </Button>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600 font-medium">{area.name}</span>
        </div>

        {/* Area Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="text-6xl">{cultureEmoji(area.culture)}</span>
            <div>
              <h1 className="text-3xl font-black text-gray-900">{area.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-gray-500">{cultureLabel(area.culture)}</span>
                <span className="text-gray-300">·</span>
                <span className="text-gray-500">{area.hectares} ha</span>
                {area.city && (
                  <>
                    <span className="text-gray-300">·</span>
                    <span className="text-gray-500">📍 {area.city}, {area.state}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={runAnalysis}
            disabled={analyzing}
            className="gap-2"
          >
            {analyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Satellite className="w-4 h-4" />
            )}
            {analyzing ? t.analyzing : t.newAnalysis}
          </Button>
        </div>

        {/* Analyzing overlay */}
        {analyzing && (
          <Card className="border-green-200 bg-green-50 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Satellite className="w-6 h-6 text-green-600 animate-pulse" />
                </div>
                <div>
                  <p className="font-bold text-green-800">{t.analysisInProgress}</p>
                  <p className="text-sm text-green-600 mt-0.5">{analyzeStep}</p>
                </div>
              </div>
              <div className="mt-4 h-2 bg-green-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full animate-pulse w-2/3" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Map, label: t.totalArea, value: `${area.hectares} ha`, color: "green" },
            { icon: Activity, label: t.diagnostics, value: diagnostics.length, color: "blue" },
            { icon: latest ? BarChart3 : Satellite, label: t.lastScore, value: latest ? `${latest.score?.toFixed(1)}/10` : "—", color: "emerald" },
            { icon: Clock, label: t.lastAnalysis, value: latest ? formatDate(latest.createdAt) : t.never, color: "amber" },
          ].map(({ icon: Icon, label, value, color }) => (
            <Card key={label}>
              <CardContent className="p-4">
                <div className={`w-9 h-9 rounded-xl bg-${color}-50 flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 text-${color}-600`} />
                </div>
                <p className="text-xl font-black text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-1">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Latest diagnostic */}
          <div className="lg:col-span-2 space-y-6">
            {latest ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t.latestDiagnostic}</CardTitle>
                    <Link href={`/dashboard/diagnostics/${latest.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1">
                        {t.viewFull} <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Score */}
                  <div className="flex items-center gap-6 mb-6">
                    <div className="relative w-24 h-24">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                        <circle
                          cx="50" cy="50" r="40" fill="none"
                          stroke={healthColor(latest.healthStatus)}
                          strokeWidth="10"
                          strokeDasharray={`${(latest.score / 10) * 251.2} 251.2`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black" style={{ color: healthColor(latest.healthStatus) }}>
                          {latest.score?.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-400">/10</span>
                      </div>
                    </div>
                    <div>
                      <div
                        className="inline-block px-3 py-1 rounded-full text-sm font-bold mb-2"
                        style={{ backgroundColor: healthBg(latest.healthStatus), color: healthColor(latest.healthStatus) }}
                      >
                        {latest.healthStatus?.replace("_", " ")}
                      </div>
                      <p className="text-sm text-gray-500">{formatDate(latest.createdAt)}</p>
                    </div>
                  </div>

                  {/* Indices */}
                  {latest.ndvi !== null && (
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        { label: "NDVI", value: latest.ndvi, icon: Leaf, desc: t.vegetation },
                        { label: "NDRE", value: latest.ndre, icon: TrendingUp, desc: t.nitrogen },
                        { label: "NDWI", value: latest.ndwi, icon: Droplets, desc: t.water },
                      ].map(({ label, value, icon: Icon, desc }) => (
                        <div key={label} className="p-3 rounded-xl bg-gray-50">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Icon className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs font-semibold text-gray-500">{label}</span>
                          </div>
                          <p className="text-lg font-black" style={{ color: ndviColor(value ?? 0) }}>
                            {value?.toFixed(3) ?? "—"}
                          </p>
                          <p className="text-xs text-gray-400">{desc}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Zone heatmap */}
                  {latest.zones && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">{t.zoneMap}</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[...latest.zones].reverse().map((zone: any, i: number) => (
                          <div
                            key={i}
                            className="h-16 rounded-xl flex flex-col items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: ndviColor(zone.ndvi ?? 0) }}
                          >
                            <span>{zone.ndvi?.toFixed(2) ?? "—"}</span>
                            <span className="opacity-75 text-[10px]">{t.zone} {zone.zone}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">← {t.low}</span>
                        <div className="flex gap-1">
                          {["#ef4444","#f97316","#facc15","#4ade80","#16a34a"].map(c => (
                            <div key={c} className="w-6 h-2 rounded-full" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">{t.high} →</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed border-2 border-gray-200">
                <CardContent className="p-12 text-center">
                  <Satellite className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">{t.noDiagnosticYet}</h3>
                  <p className="text-sm text-gray-500 mb-6">{t.noDiagnosticDesc}</p>
                  <Button onClick={runAnalysis} className="gap-2">
                    <Satellite className="w-4 h-4" /> {t.startSatelliteAnalysis}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Diagnostics history */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t.history}</h2>
            {diagnostics.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-gray-400">{t.noHistory}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {diagnostics.slice(0, 8).map((d: any) => (
                  <Link key={d.id} href={`/dashboard/diagnostics/${d.id}`}>
                    <Card className="hover:shadow-md hover:border-green-200 transition-all cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {d.score?.toFixed(1)}/10
                            </p>
                            <p className="text-xs text-gray-400">{formatDate(d.createdAt)}</p>
                          </div>
                          <div
                            className="px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{ backgroundColor: healthBg(d.healthStatus), color: healthColor(d.healthStatus) }}
                          >
                            {d.healthStatus?.replace("_", " ")}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
