"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api"
import { cultureEmoji, cultureLabel, formatDate } from "@/lib/utils"
import { Satellite, ArrowRight, Cloud, CheckCircle2, Clock, Loader2, Globe2 } from "lucide-react"

function ndviColor(v: number): string {
  if (v >= 0.7) return "#16a34a"
  if (v >= 0.5) return "#4ade80"
  if (v >= 0.3) return "#facc15"
  if (v >= 0.1) return "#f97316"
  return "#ef4444"
}

export default function SatellitePage() {
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

  return (
    <div className="min-h-screen">
      <Header title="Satélite" />

      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Análise via Satélite</h1>
          <p className="text-gray-500 text-sm mt-0.5">Processamento de imagens Sentinel-2 L2A em tempo real</p>
        </div>

        {/* Info banner */}
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Globe2 className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900 mb-1.5">Sentinel-2 L2A — Fonte: ESA / Element84</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Imagens de satélite gratuitas com resolução de 10m/pixel, atualizadas a cada 5 dias.
                  Processamos as bandas espectrais para calcular NDVI, NDRE e NDWI da sua lavoura.
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "Resolução", value: "10m/px" },
                    { label: "Revisita", value: "5 dias" },
                    { label: "Bandas", value: "13 bandas" },
                    { label: "Custo", value: "Gratuito" },
                  ].map(({ label, value }) => (
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
          {[
            { step: "1", icon: "🛰️", title: "Busca STAC", desc: "Pesquisamos imagens recentes da sua área via Earth Search API" },
            { step: "2", icon: "📡", title: "Leitura COG", desc: "Lemos as bandas do Cloud Optimized GeoTIFF remotamente" },
            { step: "3", icon: "🔬", title: "Cálculo índices", desc: "Calculamos NDVI, NDRE e NDWI pixel a pixel" },
            { step: "4", icon: "🤖", title: "Diagnóstico IA", desc: "Geramos recomendações e plano de adubação VRA" },
          ].map(({ step, icon, title, desc }) => (
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
          <h2 className="text-lg font-bold text-gray-900 mb-4">Analisar suas áreas</h2>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />)}
            </div>
          ) : areas.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-200">
              <CardContent className="p-12 text-center">
                <Satellite className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">Nenhuma área cadastrada</h3>
                <p className="text-sm text-gray-500 mb-5">Cadastre sua primeira lavoura para analisar via satélite</p>
                <Link href="/dashboard/areas/new">
                  <Button>Cadastrar área</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {areas.map((area: any) => {
                const isRunning = running === area.id
                const isDone = done.includes(area.id)
                const health = area.latestDiagnostic?.healthStatus
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
                              Última análise: {formatDate(area.latestDiagnostic.createdAt)}
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
                              Concluído!
                            </div>
                          ) : isRunning ? (
                            <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Analisando...
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
                                Analisar
                              </Button>
                              <Link href={`/dashboard/areas/${area.id}`}>
                                <Button variant="ghost" size="sm" className="gap-1">
                                  Ver área <ArrowRight className="w-3.5 h-3.5" />
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
                          <p className="text-xs text-blue-500">Processando imagens Sentinel-2...</p>
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
