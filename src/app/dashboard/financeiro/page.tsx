"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLang } from "@/hooks/useLang"
import {
  TrendingUp, TrendingDown, DollarSign, Wheat, Users, Tractor,
  Plus, Trash2, ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, BarChart3
} from "lucide-react"

const T = {
  pt: {
    pageTitle: "Fluxo de Caixa",
    heading: "Fluxo de Caixa da Safra",
    subtitle: "Calcule receitas, custos e veja se sua safra vai dar lucro — em tempo real.",
    fieldProperty: "Propriedade",
    fieldCulture: "Cultura principal",
    fieldArea: "Área (ha)",
    fieldHarvest: "Safra",
    profitable: "✅ Safra lucrativa!",
    unprofitable: "⚠️ Safra com prejuízo estimado",
    totalRevenue: "Receita total",
    totalCost: "Custo total",
    profitLoss: "Lucro / Prejuízo",
    profitMargin: "Margem de lucro",
    revenuePerHa: "Receita / ha",
    profitPerHa: "Lucro / ha",
    breakeven: "Ponto de equilíbrio",
    totalArea: "Área total",
    revenues: "Receitas",
    costs: "Custos",
    add: "Adicionar",
    descPlaceholder: "Descrição",
    qtyPlaceholder: "Qtd",
    pricePlaceholder: "R$ unit",
    noRevenue: "Nenhuma receita. Clique em Adicionar.",
    costsByCategory: "Custos por Categoria",
    harvestSummary: "📊 Resumo da Safra",
    grossRevenue: "Receita bruta",
    totalCostsMinus: "(-) Total de custos",
    netProfit: "= Lucro líquido",
    margin: "Margem",
    profitHa: "Lucro/ha",
    tipTitle: "💡 Dica SolFarm",
    tipHigh: "Excelente margem! Use o diagnóstico NDVI para manter a produtividade e reduzir desperdício com insumos.",
    tipMid: "Margem razoável. Considere aplicar VRA (taxa variável) para reduzir até 25% no custo de fertilizantes.",
    tipLow: "Margem baixa. Revise o uso de insumos com base no plano VRA do diagnóstico por satélite.",
    catInsumo: "🌿 Insumo",
    catMaoDeObra: "👷 Mão de Obra",
    catMaquinario: "🚜 Maquinário",
    catArrendamento: "🏡 Arrendamento",
    catOutros: "📦 Outros",
    unitSacas: "sacas",
    unitTon: "ton",
    unitArroba: "arroba",
    unitKg: "kg",
    unitCaixas: "caixas",
    unitUnid: "unid",
  },
  en: {
    pageTitle: "Cash Flow",
    heading: "Harvest Cash Flow",
    subtitle: "Calculate revenues, costs and see if your harvest will be profitable — in real time.",
    fieldProperty: "Property",
    fieldCulture: "Main crop",
    fieldArea: "Area (ha)",
    fieldHarvest: "Season",
    profitable: "✅ Profitable harvest!",
    unprofitable: "⚠️ Harvest at an estimated loss",
    totalRevenue: "Total revenue",
    totalCost: "Total cost",
    profitLoss: "Profit / Loss",
    profitMargin: "Profit margin",
    revenuePerHa: "Revenue / ha",
    profitPerHa: "Profit / ha",
    breakeven: "Break-even point",
    totalArea: "Total area",
    revenues: "Revenues",
    costs: "Costs",
    add: "Add",
    descPlaceholder: "Description",
    qtyPlaceholder: "Qty",
    pricePlaceholder: "$ unit",
    noRevenue: "No revenue. Click Add.",
    costsByCategory: "Costs by Category",
    harvestSummary: "📊 Harvest Summary",
    grossRevenue: "Gross revenue",
    totalCostsMinus: "(-) Total costs",
    netProfit: "= Net profit",
    margin: "Margin",
    profitHa: "Profit/ha",
    tipTitle: "💡 SolFarm Tip",
    tipHigh: "Excellent margin! Use the NDVI diagnostic to maintain productivity and reduce input waste.",
    tipMid: "Reasonable margin. Consider applying VRA (variable rate) to reduce up to 25% in fertilizer cost.",
    tipLow: "Low margin. Review input usage based on the VRA plan from the satellite diagnostic.",
    catInsumo: "🌿 Input",
    catMaoDeObra: "👷 Labor",
    catMaquinario: "🚜 Machinery",
    catArrendamento: "🏡 Lease",
    catOutros: "📦 Other",
    unitSacas: "bags",
    unitTon: "ton",
    unitArroba: "arroba",
    unitKg: "kg",
    unitCaixas: "boxes",
    unitUnid: "units",
  },
}

interface Receita {
  id: string
  descricao: string
  quantidade: number
  unidade: string
  precoUnitario: number
}

interface Custo {
  id: string
  categoria: "INSUMO" | "MAO_DE_OBRA" | "MAQUINARIO" | "ARRENDAMENTO" | "OUTROS"
  descricao: string
  valor: number
}

const CATEGORIA_COLOR: Record<string, string> = {
  INSUMO: "#16a34a",
  MAO_DE_OBRA: "#2563eb",
  MAQUINARIO: "#d97706",
  ARRENDAMENTO: "#7c3aed",
  OUTROS: "#64748b",
}

function uid() { return Math.random().toString(36).slice(2) }

function moeda(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

export default function FinanceiroPage() {
  const { lang } = useLang()
  const t = T[lang]

  const CATEGORIA_LABEL: Record<string, string> = {
    INSUMO: t.catInsumo,
    MAO_DE_OBRA: t.catMaoDeObra,
    MAQUINARIO: t.catMaquinario,
    ARRENDAMENTO: t.catArrendamento,
    OUTROS: t.catOutros,
  }

  const [nomePropriedade, setNomePropriedade] = useState("Fazenda Bom Futuro")
  const [cultura, setCultura] = useState("Soja")
  const [area, setArea] = useState(450)
  const [safra, setSafra] = useState("2025/2026")

  const [receitas, setReceitas] = useState<Receita[]>([
    { id: uid(), descricao: "Soja — produção estimada", quantidade: 2700, unidade: "sacas", precoUnitario: 130 },
  ])

  const [custos, setCustos] = useState<Custo[]>([
    { id: uid(), categoria: "INSUMO", descricao: "Sementes certificadas", valor: 18000 },
    { id: uid(), categoria: "INSUMO", descricao: "Fertilizantes NPK", valor: 42000 },
    { id: uid(), categoria: "INSUMO", descricao: "Defensivos / inoculante", valor: 31000 },
    { id: uid(), categoria: "MAO_DE_OBRA", descricao: "Funcionários temporários", valor: 12000 },
    { id: uid(), categoria: "MAQUINARIO", descricao: "Aluguel de colheitadeira", valor: 22500 },
    { id: uid(), categoria: "ARRENDAMENTO", descricao: "Arrendamento da terra", valor: 36000 },
    { id: uid(), categoria: "OUTROS", descricao: "Transporte e logística", valor: 9000 },
  ])

  const [secaoAberta, setSecaoAberta] = useState<"receitas" | "custos" | null>(null)

  const totalReceitas = useMemo(() => receitas.reduce((s, r) => s + r.quantidade * r.precoUnitario, 0), [receitas])
  const totalCustos = useMemo(() => custos.reduce((s, c) => s + c.valor, 0), [custos])
  const lucroLiquido = totalReceitas - totalCustos
  const margemLucro = totalReceitas > 0 ? (lucroLiquido / totalReceitas) * 100 : 0
  const lucroPorHectare = area > 0 ? lucroLiquido / area : 0
  const receitaPorHectare = area > 0 ? totalReceitas / area : 0

  const custosPorCategoria = useMemo(() => {
    const grupos: Record<string, number> = {}
    custos.forEach(c => {
      grupos[c.categoria] = (grupos[c.categoria] ?? 0) + c.valor
    })
    return Object.entries(grupos).sort((a, b) => b[1] - a[1])
  }, [custos])

  const isLucrativo = lucroLiquido > 0
  const pontoEquilibrio = totalCustos

  function addReceita() {
    setReceitas(prev => [...prev, { id: uid(), descricao: "", quantidade: 0, unidade: "sacas", precoUnitario: 0 }])
    setSecaoAberta("receitas")
  }

  function updateReceita(id: string, field: keyof Receita, value: any) {
    setReceitas(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  function removeReceita(id: string) {
    setReceitas(prev => prev.filter(r => r.id !== id))
  }

  function addCusto() {
    setCustos(prev => [...prev, { id: uid(), categoria: "INSUMO", descricao: "", valor: 0 }])
    setSecaoAberta("custos")
  }

  function updateCusto(id: string, field: keyof Custo, value: any) {
    setCustos(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  function removeCusto(id: string) {
    setCustos(prev => prev.filter(c => c.id !== id))
  }

  const propertyFields = [
    { label: t.fieldProperty, value: nomePropriedade, set: setNomePropriedade, type: "text" },
    { label: t.fieldCulture,  value: cultura,          set: setCultura,          type: "text" },
    { label: t.fieldArea,     value: area,              set: (v: any) => setArea(Number(v)), type: "number" },
    { label: t.fieldHarvest,  value: safra,             set: setSafra,            type: "text" },
  ]

  const units = [t.unitSacas, t.unitTon, t.unitArroba, t.unitKg, t.unitCaixas, t.unitUnid]

  const summaryRows = [
    { label: t.grossRevenue,   value: totalReceitas,  color: "text-green-700" },
    { label: t.totalCostsMinus, value: -totalCustos,  color: "text-red-600" },
    { label: t.netProfit,      value: lucroLiquido,   color: isLucrativo ? "text-green-700 font-black text-lg" : "text-red-600 font-black text-lg", border: true },
  ]

  return (
    <div className="min-h-screen">
      <Header title={t.pageTitle} />

      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-black text-gray-900">{t.heading}</h1>
          <p className="text-gray-500 text-sm mt-1">{t.subtitle}</p>
        </div>

        {/* Property data */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {propertyFields.map(({ label, value, set, type }) => (
                <div key={label}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">{label}</label>
                  <input
                    type={type}
                    value={value}
                    onChange={e => set(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-gray-200 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main result */}
        <div className={`rounded-3xl p-8 mb-6 text-white ${isLucrativo ? "bg-gradient-to-r from-green-700 to-green-500" : "bg-gradient-to-r from-red-700 to-red-500"}`}>
          <div className="flex items-center gap-3 mb-4">
            {isLucrativo ? <CheckCircle2 className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
            <h2 className="text-xl font-bold">
              {isLucrativo ? t.profitable : t.unprofitable}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-white/70 text-sm mb-1">{t.totalRevenue}</p>
              <p className="text-3xl font-black">{moeda(totalReceitas)}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">{t.totalCost}</p>
              <p className="text-3xl font-black">{moeda(totalCustos)}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">{t.profitLoss}</p>
              <p className="text-3xl font-black">{moeda(lucroLiquido)}</p>
            </div>
            <div>
              <p className="text-white/70 text-sm mb-1">{t.profitMargin}</p>
              <p className="text-3xl font-black">{margemLucro.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: t.revenuePerHa, value: moeda(receitaPorHectare), icon: TrendingUp,  color: "text-green-600", bg: "bg-green-50" },
            { label: t.profitPerHa,  value: moeda(lucroPorHectare),   icon: DollarSign,  color: isLucrativo ? "text-green-600" : "text-red-600", bg: isLucrativo ? "bg-green-50" : "bg-red-50" },
            { label: t.breakeven,    value: moeda(pontoEquilibrio),    icon: BarChart3,   color: "text-amber-600", bg: "bg-amber-50" },
            { label: t.totalArea,    value: `${area} ha`,              icon: Wheat,       color: "text-blue-600",  bg: "bg-blue-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label}>
              <CardContent className="p-4">
                <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
                <p className={`text-lg font-black ${color}`}>{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left — revenues + costs */}
          <div className="lg:col-span-2 space-y-4">

            {/* REVENUES */}
            <Card>
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    {t.revenues}
                    <span className="text-green-600 font-black ml-2">{moeda(totalReceitas)}</span>
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={addReceita} className="gap-1 text-xs">
                      <Plus className="w-3 h-3" /> {t.add}
                    </Button>
                    <button onClick={() => setSecaoAberta(secaoAberta === "receitas" ? null : "receitas")}>
                      {secaoAberta === "receitas" ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
              </CardHeader>
              {secaoAberta === "receitas" && (
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {receitas.map(r => (
                      <div key={r.id} className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl bg-green-50">
                        <input
                          className="col-span-4 h-8 px-2 rounded-lg border border-gray-200 text-sm bg-white"
                          placeholder={t.descPlaceholder}
                          value={r.descricao}
                          onChange={e => updateReceita(r.id, "descricao", e.target.value)}
                        />
                        <input
                          type="number"
                          className="col-span-2 h-8 px-2 rounded-lg border border-gray-200 text-sm bg-white text-right"
                          placeholder={t.qtyPlaceholder}
                          value={r.quantidade || ""}
                          onChange={e => updateReceita(r.id, "quantidade", Number(e.target.value))}
                        />
                        <select
                          className="col-span-2 h-8 px-1 rounded-lg border border-gray-200 text-xs bg-white"
                          value={r.unidade}
                          onChange={e => updateReceita(r.id, "unidade", e.target.value)}
                        >
                          {units.map(u => <option key={u}>{u}</option>)}
                        </select>
                        <input
                          type="number"
                          className="col-span-2 h-8 px-2 rounded-lg border border-gray-200 text-sm bg-white text-right"
                          placeholder={t.pricePlaceholder}
                          value={r.precoUnitario || ""}
                          onChange={e => updateReceita(r.id, "precoUnitario", Number(e.target.value))}
                        />
                        <div className="col-span-1 text-right">
                          <p className="text-xs font-bold text-green-700">{moeda(r.quantidade * r.precoUnitario)}</p>
                        </div>
                        <button onClick={() => removeReceita(r.id)} className="col-span-1 flex justify-center">
                          <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    ))}
                    {receitas.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-4">{t.noRevenue}</p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* COSTS */}
            <Card>
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-red-500" />
                    {t.costs}
                    <span className="text-red-500 font-black ml-2">{moeda(totalCustos)}</span>
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={addCusto} className="gap-1 text-xs">
                      <Plus className="w-3 h-3" /> {t.add}
                    </Button>
                    <button onClick={() => setSecaoAberta(secaoAberta === "custos" ? null : "custos")}>
                      {secaoAberta === "custos" ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
              </CardHeader>
              {secaoAberta === "custos" && (
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {custos.map(c => (
                      <div key={c.id} className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl bg-red-50">
                        <select
                          className="col-span-3 h-8 px-1 rounded-lg border border-gray-200 text-xs bg-white"
                          value={c.categoria}
                          onChange={e => updateCusto(c.id, "categoria", e.target.value)}
                        >
                          {Object.entries(CATEGORIA_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                        <input
                          className="col-span-6 h-8 px-2 rounded-lg border border-gray-200 text-sm bg-white"
                          placeholder={t.descPlaceholder}
                          value={c.descricao}
                          onChange={e => updateCusto(c.id, "descricao", e.target.value)}
                        />
                        <input
                          type="number"
                          className="col-span-2 h-8 px-2 rounded-lg border border-gray-200 text-sm bg-white text-right"
                          placeholder="R$"
                          value={c.valor || ""}
                          onChange={e => updateCusto(c.id, "valor", Number(e.target.value))}
                        />
                        <button onClick={() => removeCusto(c.id)} className="col-span-1 flex justify-center">
                          <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Right — cost breakdown */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t.costsByCategory}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {custosPorCategoria.map(([cat, valor]) => {
                  const pct = totalCustos > 0 ? (valor / totalCustos) * 100 : 0
                  return (
                    <div key={cat}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-gray-600">{CATEGORIA_LABEL[cat]}</span>
                        <span className="text-xs font-bold text-gray-900">{moeda(valor)}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, backgroundColor: CATEGORIA_COLOR[cat] }}
                        />
                      </div>
                      <p className="text-right text-xs text-gray-400 mt-0.5">{pct.toFixed(1)}%</p>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Final summary */}
            <Card className={`border-2 ${isLucrativo ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-bold text-gray-900 text-base">{t.harvestSummary}</h3>
                {summaryRows.map(({ label, value, color, border }) => (
                  <div key={label} className={`flex justify-between items-center ${border ? "pt-3 border-t border-gray-200" : ""}`}>
                    <span className="text-sm text-gray-600">{label}</span>
                    <span className={`text-sm font-bold ${color}`}>{moeda(value)}</span>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">{t.margin}</span>
                    <span className={`text-xs font-bold ${isLucrativo ? "text-green-700" : "text-red-600"}`}>{margemLucro.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-500">{t.profitHa}</span>
                    <span className={`text-xs font-bold ${isLucrativo ? "text-green-700" : "text-red-600"}`}>{moeda(lucroPorHectare)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tip */}
            <Card className="bg-amber-50 border-amber-100">
              <CardContent className="p-4">
                <p className="text-xs font-bold text-amber-800 mb-1">{t.tipTitle}</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  {margemLucro > 30 ? t.tipHigh : margemLucro > 10 ? t.tipMid : t.tipLow}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
