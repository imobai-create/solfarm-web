"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api"
import { AlertCircle, CheckCircle2, MapPin, Info } from "lucide-react"

// Leaflet não funciona no SSR — carrega só no cliente
const AreaMap = dynamic(() => import("@/components/AreaMap").then(m => ({ default: m.AreaMap })), {
  ssr: false,
  loading: () => (
    <div className="h-96 rounded-2xl bg-gray-100 animate-pulse flex items-center justify-center">
      <p className="text-sm text-gray-400">Carregando mapa...</p>
    </div>
  ),
})

const CULTURES = [
  ["SOYBEAN","🌱","Soja"],["CORN","🌽","Milho"],["COTTON","🌿","Algodão"],
  ["SUGARCANE","🎋","Cana-de-açúcar"],["COFFEE","☕","Café"],["WHEAT","🌾","Trigo"],
  ["RICE","🍚","Arroz"],["BEAN","🫘","Feijão"],["PASTURE","🐄","Pastagem"],["OTHER","🌿","Outro"],
]

const BIOMES = [
  ["CERRADO","🟡","Cerrado"],["AMAZON","🟢","Amazônia"],["PANTANAL","💧","Pantanal"],
  ["CAATINGA","🟠","Caatinga"],["ATLANTIC_FOREST","🌳","Mata Atlântica"],["PAMPA","🟤","Pampa"],
]

const STATES = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
]

const EXAMPLE_POLYGON = {
  type: "Polygon",
  coordinates: [[
    [-55.5, -13.0], [-55.4, -13.0], [-55.4, -12.9], [-55.5, -12.9], [-55.5, -13.0]
  ]]
}

export default function NewAreaPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    name: "",
    culture: "SOYBEAN",
    biome: "CERRADO",
    state: "MT",
    city: "",
    polygon: "",
  })

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  async function handleCreate() {
    if (!form.name || !form.culture || !form.polygon) {
      setError("Nome, cultura e polígono são obrigatórios.")
      return
    }
    let parsedPolygon
    try {
      parsedPolygon = JSON.parse(form.polygon)
    } catch {
      setError("O polígono GeoJSON está inválido. Verifique o formato.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await api.post("/areas", {
        name: form.name,
        culture: form.culture,
        biome: form.biome,
        state: form.state,
        city: form.city,
        polygon: parsedPolygon,
      })
      setSuccess(true)
      setTimeout(() => router.push(`/dashboard/areas/${res.data.id}`), 1500)
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Erro ao cadastrar área.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Área cadastrada!</h2>
          <p className="text-gray-500">Redirecionando para a área...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header title="Nova Área" />

      <div className="p-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">Cadastrar nova área</h1>
          <p className="text-gray-500 text-sm mt-1">Defina os dados e o polígono da sua lavoura</p>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step >= s ? "bg-green-600 text-white" : "bg-gray-100 text-gray-400"
                }`}
              >
                {s}
              </div>
              <span className={`text-sm font-medium ${step >= s ? "text-gray-900" : "text-gray-400"}`}>
                {s === 1 ? "Dados da área" : "Polígono / Localização"}
              </span>
              {s < 2 && <div className={`w-12 h-0.5 ${step > s ? "bg-green-600" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl mb-5 border border-red-100">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
          </div>
        )}

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Informações da lavoura</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nome da área *</label>
                <input
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Ex: Fazenda São João — Talhão 3"
                  className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
                />
              </div>

              {/* Culture */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cultura *</label>
                <div className="grid grid-cols-5 gap-2">
                  {CULTURES.map(([val, emoji, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, culture: val }))}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                        form.culture === val
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-2xl">{emoji}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Biome */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Bioma</label>
                <div className="grid grid-cols-3 gap-2">
                  {BIOMES.map(([val, emoji, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, biome: val }))}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                        form.biome === val
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <span>{emoji}</span> {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Estado</label>
                  <select
                    value={form.state}
                    onChange={set("state")}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
                  >
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cidade</label>
                  <input
                    value={form.city}
                    onChange={set("city")}
                    placeholder="Ex: Sorriso"
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={() => { if (!form.name) { setError("Nome é obrigatório."); return }; setError(""); setStep(2) }}>
                  Próximo →
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Delimite sua lavoura no mapa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Info */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700">
                  <p className="font-semibold mb-1">Como usar o mapa?</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Clique em "Minha localização" para centralizar na sua fazenda</li>
                    <li>Clique nos cantos da sua lavoura para marcar os vértices</li>
                    <li>Com 3 ou mais pontos o polígono é formado automaticamente</li>
                    <li>Use "Desfazer" para remover o último ponto ou "Limpar" para recomeçar</li>
                  </ul>
                </div>
              </div>

              {/* Interactive Map */}
              <AreaMap
                onPolygonChange={(geojson) => setForm(f => ({ ...f, polygon: geojson }))}
                initialPolygon={form.polygon}
              />

              {/* Fallback GeoJSON manual */}
              <details className="mt-2">
                <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 select-none">
                  ▸ Preferir colar GeoJSON manualmente
                </summary>
                <div className="mt-3">
                  <textarea
                    value={form.polygon}
                    onChange={set("polygon")}
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-900"
                    placeholder='{"type":"Polygon","coordinates":[[[lng,lat],[lng,lat],...]]}'
                  />
                </div>
              </details>

              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(1)}>← Voltar</Button>
                <Button
                  onClick={handleCreate}
                  loading={loading}
                  disabled={!form.polygon}
                  className="gap-2"
                >
                  <MapPin className="w-4 h-4" /> Cadastrar área
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
