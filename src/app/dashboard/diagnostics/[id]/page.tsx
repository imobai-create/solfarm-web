"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api"
import { healthColor, healthBg, cultureEmoji, cultureLabel, formatDate, severityColor, priorityColor } from "@/lib/utils"
import {
  ArrowLeft, Leaf, Droplets, TrendingUp, AlertTriangle, CheckCircle2,
  Zap, Beaker, MapPin, BarChart3, Loader2, ArrowRight, Cloud
} from "lucide-react"

function ndviColor(v: number): string {
  if (v >= 0.7) return "#16a34a"
  if (v >= 0.5) return "#4ade80"
  if (v >= 0.3) return "#facc15"
  if (v >= 0.1) return "#f97316"
  return "#ef4444"
}

type Tab = "overview" | "problems" | "recommendations" | "fertilization"

export default function DiagnosticDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [diag, setDiag] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>("overview")

  useEffect(() => {
    api.get(`/diagnostics/${id}`)
      .then(res => setDiag(res.data.diagnostic ?? res.data))
      .catch(() => router.push("/dashboard/diagnostics"))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    )
  }

  if (!diag) return null

  // Map API response fields
  const sat = diag.satelliteImage
  const ndvi = sat?.ndviMean ?? null
  const ndre = sat?.ndreMean ?? null
  const ndwi = sat?.ndwiMean ?? null
  const zones: any[] = sat?.zonesMap ?? []
  const fertilizationPlan: any[] = diag.fertilizationPlan ?? []
  const recommendedCultures: any[] = diag.recommendedCultures ?? []

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "overview", label: "Visão Geral", icon: BarChart3 },
    { id: "problems", label: `Problemas (${diag.problems?.length ?? 0})`, icon: AlertTriangle },
    { id: "recommendations", label: "Recomendações", icon: CheckCircle2 },
    { id: "fertilization", label: "Adubação VRA", icon: Beaker },
  ]

  return (
    <div className="min-h-screen">
      <Header title="" />

      <div className="p-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link href="/dashboard/diagnostics">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="w-4 h-4" /> Diagnósticos
            </Button>
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-600">{diag.area?.name}</span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{cultureEmoji(diag.area?.culture)}</span>
            <div>
              <h1 className="text-2xl font-black text-gray-900">{diag.area?.name}</h1>
              <p className="text-gray-500 mt-1">
                {cultureLabel(diag.area?.culture)} · {diag.area?.hectares} ha · {formatDate(diag.createdAt)}
              </p>
              {sat && (
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Cloud className="w-3 h-3" />
                  {sat.satellite} · {formatDate(sat.acquisitionDate)} · {sat.cloudCover?.toFixed(0)}% nuvens
                </p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-5xl font-black" style={{ color: healthColor(diag.healthStatus) }}>
              {diag.score?.toFixed(1)}
            </p>
            <p className="text-sm text-gray-400">/10 pontos</p>
            <div
              className="mt-2 inline-block px-3 py-1 rounded-full text-sm font-bold"
              style={{ backgroundColor: healthBg(diag.healthStatus), color: healthColor(diag.healthStatus) }}
            >
              {diag.healthStatus?.replace("_", " ")}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-xl w-fit">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                tab === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Indices */}
              <Card>
                <CardHeader><CardTitle>Índices Espectrais</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "NDVI", value: ndvi, icon: Leaf, desc: "Índice de Vegetação — quanto mais alto, mais saudável a planta" },
                      { label: "NDRE", value: ndre, icon: TrendingUp, desc: "Red Edge — indica nível de clorofila e nitrogênio" },
                      { label: "NDWI", value: ndwi, icon: Droplets, desc: "Índice Hídrico — estresse por seca ou excesso de água" },
                    ].map(({ label, value, icon: Icon, desc }) => (
                      <div key={label} className="p-4 rounded-2xl bg-gray-50">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                            <Icon className="w-4 h-4" style={{ color: ndviColor(value ?? 0) }} />
                          </div>
                          <span className="font-bold text-gray-700">{label}</span>
                        </div>
                        <p className="text-3xl font-black mb-1" style={{ color: value !== null ? ndviColor(value) : "#9ca3af" }}>
                          {value !== null ? value.toFixed(3) : "—"}
                        </p>
                        <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                        {/* Bar */}
                        <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: value !== null ? `${Math.max(0, Math.min(100, ((value) + 1) / 2 * 100))}%` : "0%",
                              backgroundColor: value !== null ? ndviColor(value) : "#d1d5db"
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>-1</span><span>0</span><span>+1</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* NDVI min/max */}
                  {ndvi !== null && sat?.ndviMin !== null && (
                    <div className="mt-4 flex gap-4 p-3 bg-gray-50 rounded-xl text-sm">
                      <div className="flex-1 text-center">
                        <p className="text-xs text-gray-400 mb-0.5">NDVI mín.</p>
                        <p className="font-bold" style={{ color: ndviColor(sat.ndviMin ?? 0) }}>
                          {sat.ndviMin?.toFixed(3) ?? "—"}
                        </p>
                      </div>
                      <div className="flex-1 text-center border-x border-gray-200">
                        <p className="text-xs text-gray-400 mb-0.5">NDVI médio</p>
                        <p className="font-bold" style={{ color: ndviColor(ndvi) }}>
                          {ndvi.toFixed(3)}
                        </p>
                      </div>
                      <div className="flex-1 text-center">
                        <p className="text-xs text-gray-400 mb-0.5">NDVI máx.</p>
                        <p className="font-bold" style={{ color: ndviColor(sat.ndviMax ?? 0) }}>
                          {sat.ndviMax?.toFixed(3) ?? "—"}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Zone heatmap */}
              {zones.length > 0 ? (
                <Card>
                  <CardHeader><CardTitle>Mapa de Zonas NDVI (Grade 3×3)</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[...zones].reverse().map((zone: any, i: number) => (
                        <div
                          key={i}
                          className="h-20 rounded-xl flex flex-col items-center justify-center text-white font-bold"
                          style={{ backgroundColor: ndviColor(zone.ndvi ?? 0) }}
                        >
                          <span className="text-lg">{zone.ndvi?.toFixed(2) ?? "—"}</span>
                          <span className="text-xs opacity-80">Zona {zone.zone}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">← Baixo (estresse)</span>
                      <div className="flex gap-1">
                        {["#ef4444","#f97316","#facc15","#4ade80","#16a34a"].map(c => (
                          <div key={c} className="w-8 h-3 rounded" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">Alto (saudável) →</span>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-gray-400">
                    <Leaf className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Mapa de zonas não disponível.<br />Os índices NDVI por zona requerem imagem com cobertura de área.</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-5">
              {/* Yield estimate */}
              {diag.yieldEstimate !== null && diag.yieldEstimate !== undefined && (
                <Card>
                  <CardHeader><CardTitle className="text-base">Estimativa de Produção</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Produtividade</span>
                      <span className="font-bold text-gray-900">{diag.yieldEstimate} {diag.yieldUnit}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Área total</span>
                      <span className="font-bold text-gray-700">{diag.area?.hectares?.toFixed(1)} ha</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-2">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${Math.min(100, (diag.score ?? 0) * 10)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400">Eficiência estimada: {Math.round((diag.score ?? 0) * 10)}% do potencial</p>
                  </CardContent>
                </Card>
              )}

              {/* Recommended cultures */}
              {recommendedCultures.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-base">Culturas Recomendadas</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {recommendedCultures.map((c: any, i: number) => {
                        const cultureName = typeof c === "string" ? c : c.culture
                        const reason = typeof c === "object" ? c.reason : null
                        return (
                          <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-green-50">
                            <span className="mt-0.5">{cultureEmoji(cultureName)}</span>
                            <div>
                              <span className="text-sm font-medium text-green-800">{cultureLabel(cultureName)}</span>
                              {reason && <p className="text-xs text-green-600 mt-0.5">{reason}</p>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick actions */}
              <Card>
                <CardHeader><CardTitle className="text-base">Ações</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <Link href={`/dashboard/areas/${diag.areaId}`}>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Ver área</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-300 ml-auto" />
                    </div>
                  </Link>
                  <Link href="/dashboard/marketplace">
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                      <Zap className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Comprar insumos recomendados</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-300 ml-auto" />
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* PROBLEMS TAB */}
        {tab === "problems" && (
          <div className="space-y-4">
            {!diag.problems?.length ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 mb-2">Nenhum problema detectado!</h3>
                  <p className="text-sm text-gray-500">Sua lavoura está com boa saúde.</p>
                </CardContent>
              </Card>
            ) : (
              diag.problems.map((p: any, i: number) => (
                <Card key={i}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                        style={{ backgroundColor: severityColor(p.severity) }}
                      >
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">
                            {(p.type ?? "").replace(/_/g, " ")}
                          </h3>
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                            style={{ backgroundColor: severityColor(p.severity) }}
                          >
                            {p.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{p.description}</p>
                        {p.zone && (
                          <p className="text-xs text-gray-400">
                            📍 Zonas afetadas: {p.zone}
                          </p>
                        )}
                        {p.affectedArea && (
                          <p className="text-xs text-gray-400 mt-1">
                            📐 Área afetada: ~{Math.round(p.affectedArea)}%
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* RECOMMENDATIONS TAB */}
        {tab === "recommendations" && (
          <div className="space-y-4">
            {!diag.recommendations?.length ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-sm text-gray-400">Nenhuma recomendação específica para este diagnóstico.</p>
                </CardContent>
              </Card>
            ) : (
              diag.recommendations.map((r: any, i: number) => (
                <Card key={i}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                        style={{ backgroundColor: priorityColor(r.priority) }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-gray-900">{r.action}</h3>
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                            style={{ backgroundColor: priorityColor(r.priority) }}
                          >
                            {r.priority}
                          </span>
                          {r.category && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              {r.category}
                            </span>
                          )}
                        </div>
                        {r.detail && <p className="text-sm text-gray-500 mb-2">{r.detail}</p>}
                        <div className="flex gap-4 mt-2">
                          {r.estimatedProductivityGain > 0 && (
                            <p className="text-xs text-green-600 font-medium">
                              📈 +{r.estimatedProductivityGain}% produtividade
                            </p>
                          )}
                          {r.estimatedCostReduction > 0 && (
                            <p className="text-xs text-blue-600 font-medium">
                              💰 -{r.estimatedCostReduction}% custo
                            </p>
                          )}
                        </div>
                        {r.productKeywords?.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {r.productKeywords.map((kw: string) => (
                              <Link key={kw} href={`/dashboard/marketplace?q=${encodeURIComponent(kw)}`}>
                                <span className="px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer transition-colors">
                                  🛒 {kw}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* FERTILIZATION TAB */}
        {tab === "fertilization" && (
          <div>
            {!fertilizationPlan.length ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Beaker className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="font-bold text-gray-900 mb-2">Plano VRA não disponível</h3>
                  <p className="text-sm text-gray-500">O plano de adubação por zona requer diagnóstico completo com dados NDVI de cada zona.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Totals */}
                <div className="grid grid-cols-3 gap-4">
                  {(() => {
                    const ha = diag.area?.hectares ?? 1
                    const totalN = fertilizationPlan.reduce((s, z) => s + (z.nitrogenDose ?? 0), 0) * ha / fertilizationPlan.length
                    const totalP = fertilizationPlan.reduce((s, z) => s + (z.phosphorusDose ?? 0), 0) * ha / fertilizationPlan.length
                    const totalK = fertilizationPlan.reduce((s, z) => s + (z.potassiumDose ?? 0), 0) * ha / fertilizationPlan.length
                    return (
                      <>
                        <Card>
                          <CardContent className="p-4">
                            <p className="text-xs text-gray-500 mb-1">Nitrogênio total</p>
                            <p className="text-2xl font-black text-blue-600">{Math.round(totalN)} kg</p>
                            <p className="text-xs text-gray-400">para {ha.toFixed(1)} ha</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <p className="text-xs text-gray-500 mb-1">Fósforo total</p>
                            <p className="text-2xl font-black text-amber-600">{Math.round(totalP)} kg</p>
                            <p className="text-xs text-gray-400">P₂O₅</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <p className="text-xs text-gray-500 mb-1">Potássio total</p>
                            <p className="text-2xl font-black text-purple-600">{Math.round(totalK)} kg</p>
                            <p className="text-xs text-gray-400">K₂O</p>
                          </CardContent>
                        </Card>
                      </>
                    )
                  })()}
                </div>

                {/* Zone table */}
                <Card>
                  <CardHeader><CardTitle>Dose por Zona</CardTitle></CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-3 px-2 text-gray-500 font-semibold">Zona</th>
                            <th className="text-left py-3 px-2 text-gray-500 font-semibold">NDVI</th>
                            <th className="text-left py-3 px-2 text-gray-500 font-semibold">Status</th>
                            <th className="text-right py-3 px-2 text-blue-500 font-semibold">N (kg/ha)</th>
                            <th className="text-right py-3 px-2 text-amber-500 font-semibold">P (kg/ha)</th>
                            <th className="text-right py-3 px-2 text-purple-500 font-semibold">K (kg/ha)</th>
                            {fertilizationPlan.some(z => z.limeDose) && (
                              <th className="text-right py-3 px-2 text-gray-500 font-semibold">Cal (t/ha)</th>
                            )}
                            <th className="text-left py-3 px-2 text-gray-500 font-semibold">Prioridade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fertilizationPlan.map((z: any, i: number) => (
                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                              <td className="py-3 px-2 font-bold text-gray-700">Z{z.zone}</td>
                              <td className="py-3 px-2">
                                <span className="font-mono font-bold" style={{ color: ndviColor(z.ndvi ?? 0) }}>
                                  {z.ndvi?.toFixed(3) ?? "—"}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-xs text-gray-500">{z.status}</td>
                              <td className="py-3 px-2 text-right font-bold text-blue-600">{z.nitrogenDose ?? 0}</td>
                              <td className="py-3 px-2 text-right font-bold text-amber-600">{z.phosphorusDose ?? 0}</td>
                              <td className="py-3 px-2 text-right font-bold text-purple-600">{z.potassiumDose ?? 0}</td>
                              {fertilizationPlan.some(z => z.limeDose) && (
                                <td className="py-3 px-2 text-right font-bold text-gray-600">{z.limeDose ?? "—"}</td>
                              )}
                              <td className="py-3 px-2">
                                <span
                                  className="px-2 py-0.5 rounded-full text-xs font-bold"
                                  style={{
                                    backgroundColor: z.priority === "URGENTE" ? "#fef2f2" : z.priority === "NORMAL" ? "#fffbeb" : "#f0fdf4",
                                    color: z.priority === "URGENTE" ? "#dc2626" : z.priority === "NORMAL" ? "#d97706" : "#16a34a",
                                  }}
                                >
                                  {z.priority}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Link href="/dashboard/marketplace">
                    <Button className="gap-2">
                      <Zap className="w-4 h-4" /> Comprar fertilizantes recomendados
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
