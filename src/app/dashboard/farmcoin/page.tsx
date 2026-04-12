"use client"

import { useState, useEffect } from "react"
import { api } from "@/services/api"
import { Coins, Zap, TrendingUp, ArrowUpRight, ArrowDownLeft, Leaf, Sun, Users, RefreshCw, Plus, Send } from "lucide-react"

const TX_ICON: Record<string, React.ReactNode> = {
  MINT: <Plus className="w-4 h-4 text-green-600" />,
  BURN: <TrendingUp className="w-4 h-4 text-red-500" />,
  TRANSFER: <ArrowUpRight className="w-4 h-4 text-orange-500" />,
  RECEIVE: <ArrowDownLeft className="w-4 h-4 text-blue-500" />,
  SPEND: <Zap className="w-4 h-4 text-purple-500" />,
  ENERGY_MINT: <Sun className="w-4 h-4 text-amber-500" />,
}
const TX_COLOR: Record<string, string> = {
  MINT: "text-green-600", BURN: "text-red-500", TRANSFER: "text-orange-500",
  RECEIVE: "text-blue-600", SPEND: "text-purple-500", ENERGY_MINT: "text-amber-500",
}
const TX_LABEL: Record<string, string> = {
  MINT: "Emissão", BURN: "Queima", TRANSFER: "Transferência",
  RECEIVE: "Recebimento", SPEND: "Gasto", ENERGY_MINT: "Energia Solar", LOCK: "Bloqueio", UNLOCK: "Liberação",
}

export default function FarmCoinPage() {
  const [wallet, setWallet] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [areas, setAreas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"wallet" | "emitir" | "energia" | "ranking">("wallet")

  // Formulário emissão
  const [form, setForm] = useState({ areaId: "", culture: "SOJA", declaredProduction: "", productionUnit: "sacas" })
  const [emitting, setEmitting] = useState(false)
  const [emitResult, setEmitResult] = useState<any>(null)

  // Formulário energia
  const [energy, setEnergy] = useState({ kwh: "", month: new Date().toISOString().slice(0, 7) })
  const [energyLoading, setEnergyLoading] = useState(false)
  const [energyResult, setEnergyResult] = useState<any>(null)

  useEffect(() => {
    Promise.all([
      api.get("/farmcoin/wallet"),
      api.get("/farmcoin/leaderboard"),
      api.get("/areas"),
    ]).then(([w, l, a]) => {
      setWallet(w.data.wallet)
      setTransactions(w.data.transactions)
      setLeaderboard(l.data.leaderboard)
      setAreas(a.data.data ?? [])
    }).finally(() => setLoading(false))
  }, [])

  async function handleEmit() {
    if (!form.areaId || !form.declaredProduction) return
    setEmitting(true); setEmitResult(null)
    try {
      const res = await api.post("/farmcoin/request", {
        areaId: form.areaId,
        culture: form.culture,
        declaredProduction: Number(form.declaredProduction),
        productionUnit: form.productionUnit,
      })
      setEmitResult(res.data)
      const w = await api.get("/farmcoin/wallet")
      setWallet(w.data.wallet)
      setTransactions(w.data.transactions)
    } catch (e: any) {
      setEmitResult({ error: e?.response?.data?.error ?? "Erro ao solicitar emissão" })
    } finally { setEmitting(false) }
  }

  async function handleEnergy() {
    if (!energy.kwh) return
    setEnergyLoading(true); setEnergyResult(null)
    try {
      const res = await api.post("/farmcoin/energy", { kwh: Number(energy.kwh), month: energy.month })
      setEnergyResult(res.data)
      const w = await api.get("/farmcoin/wallet")
      setWallet(w.data.wallet)
      setTransactions(w.data.transactions)
    } catch (e: any) {
      setEnergyResult({ error: e?.response?.data?.error ?? "Erro" })
    } finally { setEnergyLoading(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <RefreshCw className="w-5 h-5 animate-spin text-green-600" />
    </div>
  )

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">FARMCOIN</h1>
            <p className="text-stone-500 text-sm">Token da produção agrícola · Fase 1 — Ledger Interno</p>
          </div>
        </div>

        {/* Saldo */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white mb-6 shadow-lg">
          <p className="text-amber-100 text-sm font-semibold mb-1">Saldo disponível</p>
          <p className="text-5xl font-black mb-1">{wallet?.balance?.toFixed(2) ?? "0.00"}</p>
          <p className="text-amber-100 text-sm">FARMCOINS ≈ R$ {wallet?.balance?.toFixed(2) ?? "0.00"}</p>
          <div className="flex gap-4 mt-4 pt-4 border-t border-amber-400/40 text-sm">
            <div><p className="text-amber-200">Total emitido</p><p className="font-bold">{wallet?.totalMinted?.toFixed(0) ?? 0}</p></div>
            <div><p className="text-amber-200">Em garantia</p><p className="font-bold">{wallet?.lockedBalance?.toFixed(0) ?? 0}</p></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto">
          {([
            { key: "wallet", label: "Carteira", icon: Coins },
            { key: "emitir", label: "Emitir Tokens", icon: Plus },
            { key: "energia", label: "Energia Solar", icon: Sun },
            { key: "ranking", label: "Ranking", icon: Users },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                tab === key ? "bg-amber-500 text-white shadow" : "bg-white text-stone-500 border border-stone-200"
              }`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {/* ── Carteira ── */}
        {tab === "wallet" && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Últimas transações</h2>
              <Leaf className="w-4 h-4 text-green-500" />
            </div>
            {transactions.length === 0 ? (
              <div className="p-10 text-center text-stone-400">
                <Coins className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">Nenhuma transação ainda</p>
                <p className="text-sm mt-1">Emita seus primeiros FARMCOINS declarando sua produção</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-50">
                {transactions.map((tx: any) => (
                  <div key={tx.id} className="flex items-center gap-3 px-5 py-4">
                    <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center shrink-0">
                      {TX_ICON[tx.type] ?? <Coins className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{TX_LABEL[tx.type] ?? tx.type}</p>
                      <p className="text-xs text-stone-400 truncate">{tx.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`font-bold text-sm ${TX_COLOR[tx.type] ?? ""}`}>
                        {["TRANSFER","SPEND","BURN","LOCK"].includes(tx.type) ? "-" : "+"}{tx.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-stone-400">{new Date(tx.createdAt).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Emitir Tokens ── */}
        {tab === "emitir" && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
              <strong>Como funciona:</strong> Declare sua produção estimada. A plataforma emite FARMCOINS equivalentes a <strong>30% do valor</strong> como lastro. O NDVI da sua área valida a capacidade produtiva.
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 space-y-4">
              <h2 className="font-bold text-gray-900">Solicitar emissão de FARMCOINS</h2>

              <div>
                <label className="block text-sm font-semibold text-stone-600 mb-1.5">Área</label>
                <select value={form.areaId} onChange={e => setForm(f => ({ ...f, areaId: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
                  <option value="">Selecione a área...</option>
                  {areas.map((a: any) => (
                    <option key={a.id} value={a.id}>{a.name} ({a.hectares} ha)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-1.5">Cultura</label>
                  <select value={form.culture} onChange={e => setForm(f => ({ ...f, culture: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
                    {["SOJA","MILHO","CAFE","ALGODAO","ARROZ","FEIJAO","TRIGO","CANA","OUTRO"].map(c => (
                      <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-1.5">Unidade</label>
                  <select value={form.productionUnit} onChange={e => setForm(f => ({ ...f, productionUnit: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
                    <option value="sacas">Sacas (60kg)</option>
                    <option value="toneladas">Toneladas</option>
                    <option value="kg">Quilogramas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-600 mb-1.5">Produção declarada</label>
                <input type="number" value={form.declaredProduction}
                  onChange={e => setForm(f => ({ ...f, declaredProduction: e.target.value }))}
                  placeholder="Ex: 500"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
              </div>

              {form.declaredProduction && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                  <p className="font-bold mb-1">Estimativa de emissão:</p>
                  <p>≈ <strong>{Math.floor(Number(form.declaredProduction) * (form.culture === "SOJA" ? 130 : form.culture === "CAFE" ? 1200 : 100) * 0.3)} FARMCOINS</strong></p>
                  <p className="text-xs text-green-600 mt-1">30% do valor estimado da produção</p>
                </div>
              )}

              <button onClick={handleEmit} disabled={emitting || !form.areaId || !form.declaredProduction}
                className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition disabled:opacity-50 flex items-center justify-center gap-2">
                {emitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Coins className="w-4 h-4" />}
                Solicitar emissão
              </button>

              {emitResult?.error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{emitResult.error}</div>
              )}
              {emitResult?.requestedTokens && !emitResult.error && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                  <p className="font-bold">🎉 {emitResult.requestedTokens} FARMCOINS {emitResult.autoApproved ? "emitidos!" : "em análise"}</p>
                  <p className="text-xs mt-1">{emitResult.autoApproved ? "NDVI validado — tokens disponíveis na carteira." : "Aguardando validação manual."}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Energia Solar ── */}
        {tab === "energia" && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
              <strong>Créditos de energia solar:</strong> Registre o excedente injetado na rede e receba <strong>0,5 FARMCOIN por kWh</strong>. Base: dados da sua distribuidora ou inversor solar.
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 space-y-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2"><Sun className="w-5 h-5 text-amber-500" />Registrar excedente solar</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-1.5">kWh excedente</label>
                  <input type="number" value={energy.kwh} onChange={e => setEnergy(f => ({ ...f, kwh: e.target.value }))}
                    placeholder="Ex: 1200"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-1.5">Mês de referência</label>
                  <input type="month" value={energy.month} onChange={e => setEnergy(f => ({ ...f, month: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
                </div>
              </div>

              {energy.kwh && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                  Você receberá ≈ <strong>{Math.floor(Number(energy.kwh) * 0.5)} FARMCOINS</strong>
                </div>
              )}

              <button onClick={handleEnergy} disabled={energyLoading || !energy.kwh}
                className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition disabled:opacity-50 flex items-center justify-center gap-2">
                {energyLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sun className="w-4 h-4" />}
                Registrar e receber tokens
              </button>

              {energyResult?.error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{energyResult.error}</div>
              )}
              {energyResult?.tokensEmitted && !energyResult.error && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                  ☀️ <strong>{energyResult.tokensEmitted} FARMCOINS</strong> emitidos por energia solar!
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Ranking ── */}
        {tab === "ranking" && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100">
              <h2 className="font-bold text-gray-900">🏆 Top Produtores FARMCOIN</h2>
            </div>
            {leaderboard.length === 0 ? (
              <div className="p-10 text-center text-stone-400">Nenhum produtor com saldo ainda</div>
            ) : (
              <div className="divide-y divide-stone-50">
                {leaderboard.map((u: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                      i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-stone-100 text-stone-600" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-stone-50 text-stone-500"
                    }`}>{i + 1}</div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm">{u.name}</p>
                      <p className="text-xs text-stone-400">{u.city && u.state ? `${u.city}, ${u.state}` : "—"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-amber-600">{u.balance.toFixed(0)}</p>
                      <p className="text-xs text-stone-400">FARMCOINS</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
