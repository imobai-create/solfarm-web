import { api } from "./api"

export interface Plan {
  id: string
  name: string
  price: number
  period: string
  popular?: boolean
  features: string[]
  limits: { areas: number; diagnostics: number }
}

export interface CheckoutResult {
  message: string
  payment: {
    id: string
    status: string
    value: number
    dueDate: string
    billingType: string
    invoiceUrl?: string
    bankSlipUrl?: string
    pixQrCode?: {
      encodedImage: string
      payload: string
      expirationDate: string
    } | null
  }
  plan: {
    nome: string
    preco: number
    descricao: string
    ciclo: string
  }
}

export interface PaymentStatus {
  id: string
  status: string
  value: number
  dueDate: string
  confirmedDate?: string
}

export const paymentService = {
  async getPlans(): Promise<Plan[]> {
    const res = await api.get("/payments/plans")
    return res.data.plans
  },

  async checkout(data: {
    plan: "CAMPO" | "FAZENDA"
    billingType: "PIX" | "BOLETO" | "CREDIT_CARD" | "UNDEFINED"
    cpfCnpj?: string
    phone?: string
    recurrent?: boolean
  }): Promise<CheckoutResult> {
    const res = await api.post("/payments/checkout", { recurrent: true, ...data })
    return res.data
  },

  async cancel(subscriptionId: string): Promise<void> {
    await api.post("/payments/cancel", { subscriptionId })
  },

  async getStatus(paymentId: string): Promise<PaymentStatus> {
    const res = await api.get(`/payments/status/${paymentId}`)
    return res.data
  },

  // ── Stripe (pagamentos internacionais) ──────────────────────
  async stripeCheckout(data: {
    plan: "CAMPO" | "FAZENDA"
    currency?: "usd" | "eur" | "brl"
  }): Promise<{ checkoutUrl: string; sessionId: string }> {
    const res = await api.post("/stripe/checkout", data)
    return res.data
  },

  async stripePortal(): Promise<{ url: string }> {
    const res = await api.post("/stripe/portal")
    return res.data
  },
}
