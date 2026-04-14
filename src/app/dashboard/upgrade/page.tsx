"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { paymentService, type CheckoutResult } from "@/services/payment.service"
import { authService } from "@/services/auth.service"
import {
  Check, Zap, Crown, Leaf, ArrowRight, Copy, RefreshCw,
  QrCode, FileText, Loader2, CheckCircle2, AlertCircle, X, Globe,
} from "lucide-react"
import { useLang } from "@/hooks/useLang"

// ── tipos locais ──────────────────────────────────────────────
type BillingType = "PIX" | "BOLETO" | "CREDIT_CARD" | "UNDEFINED"
type PlanId = "FREE" | "CAMPO" | "FAZENDA"
type Region = "br" | "intl"

const PLAN_ICONS: Record<PlanId, React.ReactNode> = {
  FREE: <Leaf className="w-5 h-5 text-green-600" />,
  CAMPO: <Zap className="w-5 h-5 text-amber-500" />,
  FAZENDA: <Crown className="w-5 h-5 text-purple-600" />,
}

const PLAN_COLORS: Record<PlanId, string> = {
  FREE: "border-green-200",
  CAMPO: "border-amber-400 ring-2 ring-amber-200",
  FAZENDA: "border-purple-300",
}

const PLAN_BTN: Record<PlanId, string> = {
  FREE: "bg-green-100 text-green-800 hover:bg-green-200",
  CAMPO: "bg-amber-500 text-white hover:bg-amber-600",
  FAZENDA: "bg-purple-600 text-white hover:bg-purple-700",
}

// Preços internacionais (US$)
const INTL_PRICES: Record<string, string> = {
  CAMPO: "US$ 9.99",
  FAZENDA: "US$ 29.99",
}

// ── Plan name translation ─────────────────────────────────────
const PLAN_NAMES: Record<string, { pt: string; en: string }> = {
  FREE:   { pt: "Grátis", en: "Free" },
  CAMPO:  { pt: "Campo",  en: "Field" },
  FAZENDA:{ pt: "Fazenda",en: "Farm"  },
}

// ─────────────────────────────────────────────────────────────
function UpgradePage() {
  const [plans, setPlans] = useState<any[]>([])
  const [currentPlan, setCurrentPlan] = useState<PlanId>("FREE")
  const { lang } = useLang()
  const [region, setRegion] = useState<Region>("br")
  const [billing, setBilling] = useState<BillingType>("PIX")
  const [cpfCnpj, setCpfCnpj] = useState("")
  const [selectedPlan, setSelectedPlan] = useState<"CAMPO" | "FAZENDA" | null>(null)
  const [checkout, setCheckout] = useState<CheckoutResult | null>(null)
  const [loading, setLoading] = useState<string | null>(null)   // plan id being loaded
  const [polling, setPolling] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stripeSuccess, setStripeSuccess] = useState(false)

  const searchParams = useSearchParams()

  useEffect(() => {
    paymentService.getPlans().then(setPlans).catch(() => {})
    const user = authService.getStoredUser()
    if (user?.plan) setCurrentPlan(user.plan as PlanId)

    // Auto-seleciona plano se veio da home
    const planFromUrl = searchParams.get("plan") as "CAMPO" | "FAZENDA" | null
    if (planFromUrl === "CAMPO" || planFromUrl === "FAZENDA") {
      setSelectedPlan(planFromUrl)
    }

    // Stripe retornou com sucesso
    if (searchParams.get("success") === "true") {
      setStripeSuccess(true)
      const planParam = searchParams.get("plan") as "CAMPO" | "FAZENDA" | null
      if (planParam) {
        const user = authService.getStoredUser()
        if (user) {
          user.plan = planParam
          localStorage.setItem("solfarm_user", JSON.stringify(user))
          setCurrentPlan(planParam)
        }
      }
    }
  }, [searchParams])

  // ── polling de status após checkout Asaas ───────────────────
  const pollStatus = useCallback(async (paymentId: string) => {
    setPolling(true)
    let tries = 0
    const interval = setInterval(async () => {
      tries++
      try {
        const s = await paymentService.getStatus(paymentId)
        if (s.status === "CONFIRMED" || s.status === "RECEIVED") {
          setPaymentStatus("CONFIRMED")
          clearInterval(interval)
          setPolling(false)
          const user = authService.getStoredUser()
          if (user && selectedPlan) {
            user.plan = selectedPlan
            localStorage.setItem("solfarm_user", JSON.stringify(user))
          }
        } else if (tries >= 20) {
          clearInterval(interval)
          setPolling(false)
        }
      } catch {
        clearInterval(interval)
        setPolling(false)
      }
    }, 6000)
  }, [selectedPlan])

  // ── checkout Brasil (Asaas) ──────────────────────────────────
  async function handleBrCheckout(plan: "CAMPO" | "FAZENDA") {
    setSelectedPlan(plan)
    setError(null)
    setCheckout(null)
    setPaymentStatus(null)
    setLoading(plan)
    try {
      const result = await paymentService.checkout({
        plan,
        billingType: billing,
        cpfCnpj: cpfCnpj.replace(/\D/g, "") || undefined,
        recurrent: true,
      })
      setCheckout(result)
      if ((billing === "CREDIT_CARD" || billing === "UNDEFINED") && result.payment?.invoiceUrl) {
        window.open(result.payment.invoiceUrl, "_blank")
        return
      }
      if (billing === "PIX") {
        pollStatus(result.payment.id)
      }
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Erro ao gerar cobrança. Tente novamente.")
    } finally {
      setLoading(null)
    }
  }

  // ── checkout Internacional (Stripe) ─────────────────────────
  async function handleStripeCheckout(plan: "CAMPO" | "FAZENDA") {
    setSelectedPlan(plan)
    setError(null)
    setLoading(plan)
    try {
      const { checkoutUrl } = await paymentService.stripeCheckout({ plan, currency: "usd" })
      window.location.href = checkoutUrl
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Erro ao iniciar pagamento internacional. Tente novamente.")
      setLoading(null)
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleClose() {
    setCheckout(null)
    setSelectedPlan(null)
    setPaymentStatus(null)
    setError(null)
  }

  function formatDoc(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 14)
    if (digits.length <= 11) {
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    }
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
  }

  const isPaid = paymentStatus === "CONFIRMED"

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            {lang === "pt" ? "Escolha seu plano" : "Choose your plan"}
          </h1>
          <p className="text-stone-500 text-base">
            {lang === "pt"
              ? "Desbloqueie o potencial completo da sua fazenda com tecnologia de satélite e IA"
              : "Unlock your farm's full potential with satellite technology and AI"}
          </p>
          {currentPlan !== "FREE" && (
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              {lang === "pt" ? "Plano atual:" : "Current plan:"} <strong>{PLAN_NAMES[currentPlan]?.[lang] ?? currentPlan}</strong>
            </div>
          )}
        </div>

        {/* Toggle região */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1">
            {([
              { id: "br",   label: "🇧🇷 Brasil (R$)" },
              { id: "intl", label: "🌍 Internacional (US$)" },
            ] as { id: Region; label: string }[]).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setRegion(id)}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                  region === id
                    ? "bg-white shadow text-gray-800"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Banner internacional */}
        {region === "intl" && (
          <div className="flex justify-center mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-4 text-center max-w-lg w-full">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Globe className="w-4 h-4 text-blue-600" />
                <p className="text-blue-800 font-semibold text-sm">
                  {lang === "pt" ? "Pagamento internacional via Stripe" : "International payment via Stripe"}
                </p>
              </div>
              <p className="text-blue-600 text-xs">
                {lang === "pt"
                  ? "Cartão de crédito internacional · Apple Pay · Google Pay · 135+ países"
                  : "International credit card · Apple Pay · Google Pay · 135+ countries"}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-3 text-xs text-blue-500">
                <span>🔒 SSL / PCI-DSS</span>
                <span>·</span>
                <span>💰 USD · EUR · BRL</span>
                <span>·</span>
                <span>↩️ Cancel anytime</span>
              </div>
            </div>
          </div>
        )}

        {/* Toggle billing (somente Brasil) */}
        {region === "br" && (
          <>
            <div className="flex flex-col items-center mb-6">
              <div className="inline-flex bg-white rounded-xl border border-stone-200 p-1 gap-1 flex-wrap justify-center">
                {([
                  { id: "PIX",         label: "⚡ PIX" },
                  { id: "CREDIT_CARD", label: lang === "pt" ? "💳 Cartão BR" : "💳 BR Card" },
                  { id: "BOLETO",      label: lang === "pt" ? "📄 Boleto" : "📄 Bank Slip" },
                  { id: "UNDEFINED",   label: "🔗 Link" },
                ] as { id: BillingType; label: string }[]).map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setBilling(id)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      billing === id
                        ? "bg-green-600 text-white shadow"
                        : "text-stone-500 hover:text-stone-700"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {billing === "CREDIT_CARD" && (
                <p className="text-xs text-stone-500 text-center mt-2">
                  {lang === "pt"
                    ? "🔒 Dados do cartão inseridos diretamente na página segura do Asaas"
                    : "🔒 Card data entered directly on Asaas secure page"}
                </p>
              )}
              {billing === "UNDEFINED" && (
                <p className="text-xs text-stone-500 text-center mt-2">
                  {lang === "pt"
                    ? "🔗 Você escolhe o método na hora do pagamento (PIX, cartão ou boleto)"
                    : "🔗 Choose your payment method at checkout (PIX, card or bank slip)"}
                </p>
              )}
            </div>

            {/* CPF/CNPJ */}
            <div className="flex justify-center mb-8">
              <div className="w-full max-w-xs">
                <label className="block text-xs font-semibold text-stone-500 mb-1 text-center uppercase tracking-wide">
                  {lang === "pt" ? "CPF ou CNPJ (opcional)" : "CPF or CNPJ (optional, Brazil only)"}
                </label>
                <input
                  type="text"
                  value={cpfCnpj}
                  onChange={(e) => setCpfCnpj(formatDoc(e.target.value))}
                  placeholder="000.000.000-00"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>
          </>
        )}

        {/* Cards de planos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {plans.map((plan) => {
            const id = plan.id as PlanId
            const isCurrent = id === currentPlan
            const isFree = id === "FREE"
            const isLoading = loading === id

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl border-2 p-6 flex flex-col shadow-sm transition-all hover:shadow-md ${PLAN_COLORS[id]}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow">
                      {lang === "pt" ? "MAIS POPULAR" : "MOST POPULAR"}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center">
                    {PLAN_ICONS[id]}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-gray-900">
                      {PLAN_NAMES[plan.id]?.[lang] ?? plan.name}
                    </h2>
                    {isCurrent && (
                      <span className="text-xs text-green-600 font-semibold">
                        {lang === "pt" ? "✓ Plano atual" : "✓ Current plan"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Preço */}
                <div className="mb-5">
                  {plan.price === 0 ? (
                    <span className="text-3xl font-black text-gray-900">{lang === "pt" ? "Grátis" : "Free"}</span>
                  ) : region === "intl" ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-gray-900">{INTL_PRICES[id]}</span>
                      <span className="text-stone-400 text-sm">/mo</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-semibold text-stone-400">R$</span>
                      <span className="text-4xl font-black text-gray-900">{plan.price}</span>
                      <span className="text-stone-400 text-sm">/{plan.period}</span>
                    </div>
                  )}
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {plan.features.map((f: string) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-stone-600">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={isFree || isCurrent || isLoading}
                  onClick={() => {
                    if (isFree || isCurrent) return
                    const p = id as "CAMPO" | "FAZENDA"
                    if (region === "intl") handleStripeCheckout(p)
                    else handleBrCheckout(p)
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    region === "intl" && !isFree && !isCurrent
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : PLAN_BTN[id]
                  } ${(isFree || isCurrent) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isCurrent ? (
                    lang === "pt" ? "Plano atual" : "Current plan"
                  ) : isFree ? (
                    lang === "pt" ? "Gratuito sempre" : "Always free"
                  ) : region === "intl" ? (
                    <>
                      <Globe className="w-4 h-4" />
                      Subscribe with Stripe
                    </>
                  ) : (
                    <>
                      {lang === "pt" ? "Assinar" : "Subscribe"} {PLAN_NAMES[plan.id]?.[lang] ?? plan.name}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* Erro */}
        {error && (
          <div className="max-w-lg mx-auto mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Modal de checkout Asaas */}
        {checkout && !isPaid && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">

              <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-5 text-white">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/20 transition"
                >
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-black mb-1">
                  {billing === "PIX"
                    ? (lang === "pt" ? "⚡ Pague com PIX" : "⚡ Pay with PIX")
                    : (lang === "pt" ? "📄 Boleto Bancário" : "📄 Bank Slip")}
                </h2>
                <p className="text-green-100 text-sm">
                  {lang === "pt" ? "Plano" : "Plan"} {checkout.plan.nome} — <strong>R$ {checkout.payment.value.toFixed(2)}</strong>
                </p>
              </div>

              <div className="p-6">
                {billing === "PIX" && checkout.payment.pixQrCode ? (
                  <>
                    <div className="flex flex-col items-center mb-5">
                      <div className="p-3 bg-white border-2 border-green-200 rounded-xl shadow-inner mb-3">
                        <img
                          src={`data:image/png;base64,${checkout.payment.pixQrCode.encodedImage}`}
                          alt="QR Code PIX"
                          className="w-48 h-48 object-contain"
                        />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        {polling && <RefreshCw className="w-3 h-3 animate-spin" />}
                        {polling
                          ? (lang === "pt" ? "Aguardando confirmação..." : "Waiting for confirmation...")
                          : (lang === "pt" ? "QR Code gerado" : "QR Code generated")}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
                        {lang === "pt" ? "PIX Copia e Cola" : "PIX Copy & Paste"}
                      </label>
                      <div className="flex gap-2">
                        <input
                          readOnly
                          value={checkout.payment.pixQrCode.payload}
                          className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs bg-stone-50 font-mono overflow-hidden text-ellipsis"
                        />
                        <button
                          onClick={() => handleCopy(checkout.payment.pixQrCode!.payload)}
                          className={`px-3 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all ${
                            copied
                              ? "bg-green-100 text-green-700"
                              : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                          }`}
                        >
                          <Copy className="w-3.5 h-3.5" />
                          {copied ? (lang === "pt" ? "Copiado!" : "Copied!") : (lang === "pt" ? "Copiar" : "Copy")}
                        </button>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
                      <strong>{lang === "pt" ? "Vence em:" : "Expires at:"}</strong>{" "}
                      {new Date(checkout.payment.pixQrCode.expirationDate).toLocaleString(lang === "pt" ? "pt-BR" : "en-US")}
                      <br />
                      {lang === "pt"
                        ? "Após o pagamento, seu plano será ativado automaticamente."
                        : "After payment, your plan will be activated automatically."}
                    </div>
                  </>
                ) : billing === "BOLETO" ? (
                  <>
                    <div className="flex flex-col items-center gap-4 py-4">
                      <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center">
                        <FileText className="w-10 h-10 text-blue-500" />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-gray-900 mb-1">
                          {lang === "pt" ? "Boleto gerado com sucesso!" : "Bank slip generated!"}
                        </p>
                        <p className="text-sm text-stone-500">
                          {lang === "pt" ? "Vencimento:" : "Due date:"}{" "}
                          {new Date(checkout.payment.dueDate).toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US")}
                        </p>
                      </div>
                      <a
                        href={checkout.payment.bankSlipUrl ?? checkout.payment.invoiceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm text-center hover:bg-blue-700 transition"
                      >
                        {lang === "pt" ? "Visualizar / Imprimir Boleto" : "View / Print Bank Slip"}
                      </a>
                    </div>
                    <div className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-600">
                      {lang === "pt"
                        ? "O boleto pode levar até 3 dias úteis para compensar. Seu plano será ativado após a confirmação."
                        : "Bank slip may take up to 3 business days to clear. Your plan will be activated after confirmation."}
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center text-stone-400">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
                    {lang === "pt" ? "Gerando cobrança..." : "Generating charge..."}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal de sucesso (Asaas polling) */}
        {isPaid && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">
                {lang === "pt" ? "Pagamento confirmado! 🎉" : "Payment confirmed! 🎉"}
              </h2>
              <p className="text-stone-500 mb-6">
                {lang === "pt"
                  ? <>Seu plano <strong>{checkout?.plan.nome}</strong> foi ativado. Bem-vindo ao SolFarm Pro!</>
                  : <>Your <strong>{checkout?.plan.nome}</strong> plan is now active. Welcome to SolFarm Pro!</>}
              </p>
              <button
                onClick={() => { handleClose(); window.location.href = "/dashboard" }}
                className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition"
              >
                {lang === "pt" ? "Ir para o dashboard" : "Go to dashboard →"}
              </button>
            </div>
          </div>
        )}

        {/* Modal de sucesso (Stripe redirect) */}
        {stripeSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Subscription active! 🎉</h2>
              <p className="text-stone-500 mb-6">
                Your plan was activated successfully. Welcome to SolFarm Pro!
              </p>
              <button
                onClick={() => { setStripeSuccess(false); window.location.href = "/dashboard" }}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
              >
                Go to dashboard →
              </button>
            </div>
          </div>
        )}

        {/* Rodapé de segurança */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-stone-400 mt-4">
          {region === "br" ? (
            <>
              <span>🔒 {lang === "pt" ? "Pagamentos seguros via Asaas" : "Secure payments via Asaas"}</span>
              <span>📄 {lang === "pt" ? "Nota fiscal automática" : "Automatic invoice"}</span>
              <span>↩️ {lang === "pt" ? "Cancele quando quiser" : "Cancel anytime"}</span>
              <span>🇧🇷 PIX {lang === "pt" ? "instantâneo" : "instant transfer"}</span>
            </>
          ) : (
            <>
              <span>🔒 Secure payments via Stripe</span>
              <span>🌍 135+ countries</span>
              <span>↩️ Cancel anytime</span>
              <span>💳 Apple Pay · Google Pay</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-green-600 font-semibold">Carregando...</div>}>
      <UpgradePage />
    </Suspense>
  )
}
