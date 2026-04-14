"use client"

import { useState, useEffect } from "react"
import { api } from "@/services/api"
import { useLang } from "@/hooks/useLang"
import { Coins, Zap, TrendingUp, ArrowUpRight, ArrowDownLeft, Leaf, Sun, Users, RefreshCw, Plus, Send } from "lucide-react"

const T = {
  pt: {
    subtitle: "Token da produção agrícola · Fase 1 — Ledger Interno",
    availableBalance: "Saldo disponível",
    farmcoinsApprox: (v: string) => `FARMCOINS ≈ R$ ${v}`,
    totalMinted: "Total emitido",
    inEscrow: "Em garantia",
    tabWallet: "Carteira",
    tabEmit: "Emitir Tokens",
    tabEnergy: "Energia Solar",
    tabRanking: "Ranking",
    lastTransactions: "Últimas transações",
    noTransactions: "Nenhuma transação ainda",
    noTransactionsDesc: "Emita seus primeiros FARMCOINS declarando sua produção",
    emitTitle: "Solicitar emissão de FARMCOINS",
    emitInfo: "Declare sua produção estimada. A plataforma emite FARMCOINS equivalentes a 30% do valor como lastro. O NDVI da sua área valida a capacidade produtiva.",
    emitInfoStrong: "Como funciona:",
    emitInfoStrong2: "30% do valor",
    labelArea: "Área",
    selectArea: "Selecione a área...",
    labelCulture: "Cultura",
    labelUnit: "Unidade",
    unitBags: "Sacas (60kg)",
    unitTons: "Toneladas",
    unitKg: "Quilogramas",
    labelDeclaredProduction: "Produção declarada",
    productionPlaceholder: "Ex: 500",
    emissionEstimate: "Estimativa de emissão:",
    emissionPct: "30% do valor estimado da produção",
    requestEmission: "Solicitar emissão",
    emitting: "Emitindo...",
    emitSuccess: (tokens: number, approved: boolean) =>
      `🎉 ${tokens} FARMCOINS ${approved ? "emitidos!" : "em análise"}`,
    emitSuccessDesc: (approved: boolean) =>
      approved ? "NDVI validado — tokens disponíveis na carteira." : "Aguardando validação manual.",
    emitError: "Erro ao solicitar emissão",
    energyTitle: "Registrar excedente solar",
    energyInfo: "Créditos de energia solar: Registre o excedente injetado na rede e receba 0,5 FARMCOIN por kWh. Base: dados da sua distribuidora ou inversor solar.",
    energyInfoStrong: "Créditos de energia solar:",
    energyInfoStrong2: "0,5 FARMCOIN por kWh",
    labelKwh: "kWh excedente",
    kwhPlaceholder: "Ex: 1200",
    labelMonth: "Mês de referência",
    energyEstimate: (tokens: number) => `Você receberá ≈ ${tokens} FARMCOINS`,
    registerEnergy: "Registrar e receber tokens",
    energyLoading: "Registrando...",
    energySuccess: (tokens: number) => `☀️ ${tokens} FARMCOINS emitidos por energia solar!`,
    energyError: "Erro",
    rankingTitle: "🏆 Top Produtores FARMCOIN",
    noRanking: "Nenhum produtor com saldo ainda",
    farmcoins: "FARMCOINS",
    txMint: "Emissão",
    txBurn: "Queima",
    txTransfer: "Transferência",
    txReceive: "Recebimento",
    txSpend: "Gasto",
    txEnergyMint: "Energia Solar",
    txLock: "Bloqueio",
    txUnlock: "Liberação",
  },
  en: {
    subtitle: "Agricultural production token · Phase 1 — Internal Ledger",
    availableBalance: "Available balance",
    farmcoinsApprox: (v: string) => `FARMCOINS ≈ R$ ${v}`,
    totalMinted: "Total minted",
    inEscrow: "In escrow",
    tabWallet: "Wallet",
    tabEmit: "Mint Tokens",
    tabEnergy: "Solar Energy",
    tabRanking: "Ranking",
    lastTransactions: "Latest transactions",
    noTransactions: "No transactions yet",
    noTransactionsDesc: "Mint your first FARMCOINs by declaring your production",
    emitTitle: "Request FARMCOIN minting",
    emitInfo: "Declare your estimated production. The platform mints FARMCOINs equivalent to 30% of the value as collateral. The NDVI of your area validates production capacity.",
    emitInfoStrong: "How it works:",
    emitInfoStrong2: "30% of the value",
    labelArea: "Area",
    selectArea: "Select area...",
    labelCulture: "Crop",
    labelUnit: "Unit",
    unitBags: "Bags (60kg)",
    unitTons: "Tonnes",
    unitKg: "Kilograms",
    labelDeclaredProduction: "Declared production",
    productionPlaceholder: "E.g. 500",
    emissionEstimate: "Minting estimate:",
    emissionPct: "30% of the estimated production value",
    requestEmission: "Request minting",
    emitting: "Minting...",
    emitSuccess: (tokens: number, approved: boolean) =>
      `🎉 ${tokens} FARMCOINS ${approved ? "minted!" : "under review"}`,
    emitSuccessDesc: (approved: boolean) =>
      approved ? "NDVI validated — tokens available in wallet." : "Awaiting manual validation.",
    emitError: "Failed to request minting",
    energyTitle: "Register solar surplus",
    energyInfo: "Solar energy credits: Register surplus injected into the grid and receive 0.5 FARMCOIN per kWh. Source: data from your utility or solar inverter.",
    energyInfoStrong: "Solar energy credits:",
    energyInfoStrong2: "0.5 FARMCOIN per kWh",
    labelKwh: "Surplus kWh",
    kwhPlaceholder: "E.g. 1200",
    labelMonth: "Reference month",
    energyEstimate: (tokens: number) => `You will receive ≈ ${tokens} FARMCOINS`,
    registerEnergy: "Register and receive tokens",
    energyLoading: "Registering...",
    energySuccess: (tokens: number) => `☀️ ${tokens} FARMCOINS minted from solar energy!`,
    energyError: "Error",
    rankingTitle: "🏆 Top FARMCOIN Producers",
    noRanking: "No producers with balance yet",
    farmcoins: "FARMCOINS",
    txMint: "Mint",
    txBurn: "Burn",
    txTransfer: "Transfer",
    txReceive: "Receive",
    txSpend: "Spend",
    txEnergyMint: "Solar Energy",
    txLock: "Lock",
    txUnlock: "Unlock",
  },
}

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

export default function FarmCoinPage() {
  const { lang } = useLang()
  const t = T[lang]

  const TX_LABEL: Record<string, string> = {
    MINT: t.txMint,
    BURN: t.txBurn,
    TRANSFER: t.txTransfer,
    RECEIVE: t.txReceive,
    SPEND: t.txSpend,
    ENERGY_MINT: t.txEnergyMint,
    LOCK: t.txLock,
    UNLOCK: t.txUnlock,
  }

  const [wallet, setWallet] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [areas, setAreas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"wallet" | "emitir" | "energia" | "ranking">("wallet")

  const [form, setForm] = useState({ areaId: "", culture: "SOJA", declaredProduction: "", productionUnit: "sacas" })
  const [emitting, setEmitting] = useState(false)
  const [emitResult, setEmitResult] = useState<any>(null)

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
      setEmitResult({ error: e?.response?.data?.error ?? t.emitError })
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
      setEnergyResult({ error: e?.response?.data?.error ?? t.energyError })
    } finally { setEnergyLoading(false) }
  }

  const tabs = [
    { key: "wallet",  label: t.tabWallet,  icon: Coins },
    { key: "emitir",  label: t.tabEmit,    icon: Plus },
    { key: "energia", label: t.tabEnergy,  icon: Sun },
    { key: "ranking", label: t.tabRanking, icon: Users },
  ] as const

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
            <p className="text-stone-500 text-sm">{t.subtitle}</p>
          </div>
        </div>

        {/* Balance */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white mb-6 shadow-lg">
          <p className="text-amber-100 text-sm font-semibold mb-1">{t.availableBalance}</p>
          <p className="text-5xl font-black mb-1">{wallet?.balance?.toFixed(2) ?? "0.00"}</p>
          <p className="text-amber-100 text-sm">{t.farmcoinsApprox(wallet?.balance?.toFixed(2) ?? "0.00")}</p>
          <div className="flex gap-4 mt-4 pt-4 border-t border-amber-400/40 text-sm">
            <div><p className="text-amber-200">{t.totalMinted}</p><p className="font-bold">{wallet?.totalMinted?.toFixed(0) ?? 0}</p></div>
            <div><p className="text-amber-200">{t.inEscrow}</p><p className="font-bold">{wallet?.lockedBalance?.toFixed(0) ?? 0}</p></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                tab === key ? "bg-amber-500 text-white shadow" : "bg-white text-stone-500 border border-stone-200"
              }`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {/* Wallet tab */}
        {tab === "wallet" && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">{t.lastTransactions}</h2>
              <Leaf className="w-4 h-4 text-green-500" />
            </div>
            {transactions.length === 0 ? (
              <div className="p-10 text-center text-stone-400">
                <Coins className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">{t.noTransactions}</p>
                <p className="text-sm mt-1">{t.noTransactionsDesc}</p>
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

        {/* Mint tab */}
        {tab === "emitir" && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
              <strong>{t.emitInfoStrong}</strong> {lang === "pt"
                ? <>Declare sua produção estimada. A plataforma emite FARMCOINS equivalentes a <strong>{t.emitInfoStrong2}</strong> como lastro. O NDVI da sua área valida a capacidade produtiva.</>
                : <>Declare your estimated production. The platform mints FARMCOINs equivalent to <strong>{t.emitInfoStrong2}</strong> as collateral. The NDVI of your area validates production capacity.</>
              }
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 space-y-4">
              <h2 className="font-bold text-gray-900">{t.emitTitle}</h2>

              <div>
                <label className="block text-sm font-semibold text-stone-600 mb-1.5">{t.labelArea}</label>
                <select value={form.areaId} onChange={e => setForm(f => ({ ...f, areaId: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
                  <option value="">{t.selectArea}</option>
                  {areas.map((a: any) => (
                    <option key={a.id} value={a.id}>{a.name} ({a.hectares} ha)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-1.5">{t.labelCulture}</label>
                  <select value={form.culture} onChange={e => setForm(f => ({ ...f, culture: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
                    {["SOJA","MILHO","CAFE","ALGODAO","ARROZ","FEIJAO","TRIGO","CANA","OUTRO"].map(c => (
                      <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-1.5">{t.labelUnit}</label>
                  <select value={form.productionUnit} onChange={e => setForm(f => ({ ...f, productionUnit: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
                    <option value="sacas">{t.unitBags}</option>
                    <option value="toneladas">{t.unitTons}</option>
                    <option value="kg">{t.unitKg}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-stone-600 mb-1.5">{t.labelDeclaredProduction}</label>
                <input type="number" value={form.declaredProduction}
                  onChange={e => setForm(f => ({ ...f, declaredProduction: e.target.value }))}
                  placeholder={t.productionPlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
              </div>

              {form.declaredProduction && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                  <p className="font-bold mb-1">{t.emissionEstimate}</p>
                  <p>≈ <strong>{Math.floor(Number(form.declaredProduction) * (form.culture === "SOJA" ? 130 : form.culture === "CAFE" ? 1200 : 100) * 0.3)} FARMCOINS</strong></p>
                  <p className="text-xs text-green-600 mt-1">{t.emissionPct}</p>
                </div>
              )}

              <button onClick={handleEmit} disabled={emitting || !form.areaId || !form.declaredProduction}
                className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition disabled:opacity-50 flex items-center justify-center gap-2">
                {emitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Coins className="w-4 h-4" />}
                {emitting ? t.emitting : t.requestEmission}
              </button>

              {emitResult?.error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{emitResult.error}</div>
              )}
              {emitResult?.requestedTokens && !emitResult.error && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                  <p className="font-bold">{t.emitSuccess(emitResult.requestedTokens, emitResult.autoApproved)}</p>
                  <p className="text-xs mt-1">{t.emitSuccessDesc(emitResult.autoApproved)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Energy tab */}
        {tab === "energia" && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
              <strong>{t.energyInfoStrong}</strong> {lang === "pt"
                ? <>Registre o excedente injetado na rede e receba <strong>{t.energyInfoStrong2}</strong>. Base: dados da sua distribuidora ou inversor solar.</>
                : <>Register surplus injected into the grid and receive <strong>{t.energyInfoStrong2}</strong>. Source: data from your utility or solar inverter.</>
              }
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 space-y-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2"><Sun className="w-5 h-5 text-amber-500" />{t.energyTitle}</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-1.5">{t.labelKwh}</label>
                  <input type="number" value={energy.kwh} onChange={e => setEnergy(f => ({ ...f, kwh: e.target.value }))}
                    placeholder={t.kwhPlaceholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-stone-600 mb-1.5">{t.labelMonth}</label>
                  <input type="month" value={energy.month} onChange={e => setEnergy(f => ({ ...f, month: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
                </div>
              </div>

              {energy.kwh && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                  {t.energyEstimate(Math.floor(Number(energy.kwh) * 0.5))}
                </div>
              )}

              <button onClick={handleEnergy} disabled={energyLoading || !energy.kwh}
                className="w-full py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition disabled:opacity-50 flex items-center justify-center gap-2">
                {energyLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sun className="w-4 h-4" />}
                {energyLoading ? t.energyLoading : t.registerEnergy}
              </button>

              {energyResult?.error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{energyResult.error}</div>
              )}
              {energyResult?.tokensEmitted && !energyResult.error && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                  {t.energySuccess(energyResult.tokensEmitted)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ranking tab */}
        {tab === "ranking" && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100">
              <h2 className="font-bold text-gray-900">{t.rankingTitle}</h2>
            </div>
            {leaderboard.length === 0 ? (
              <div className="p-10 text-center text-stone-400">{t.noRanking}</div>
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
                      <p className="text-xs text-stone-400">{t.farmcoins}</p>
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
