"use client"

import { useEffect, useState, useCallback } from "react"
import { Header } from "@/components/layout/Header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/services/api"
import { useLang } from "@/hooks/useLang"
import { Search, ShoppingCart, Package, Beaker, Leaf, Droplets, Tractor, Wrench, Plus, X } from "lucide-react"

const T = {
  pt: {
    pageTitle:          "Marketplace Agrícola",
    pageSubtitle:       "Insumos, sementes e máquinas para sua lavoura",
    advertise:          "Anunciar produto",
    cart:               "Carrinho",
    searchPlaceholder:  "Buscar produtos, marcas, categorias...",
    modalTitle:         "Anunciar produto",
    labelName:          "Nome do produto *",
    labelCategory:      "Categoria *",
    labelUnit:          "Unidade *",
    labelPrice:         "Preço (R$) *",
    labelStock:         "Estoque (qtd)",
    labelBrand:         "Marca",
    labelState:         "Estado (UF)",
    labelDescription:   "Descrição",
    placeholderName:    "Ex: Ureia 45% N",
    placeholderUnit:    "sc 50kg / L / un",
    placeholderBrand:   "Marca do produto",
    placeholderState:   "MG",
    placeholderDesc:    "Descreva o produto...",
    cancel:             "Cancelar",
    publish:            "Publicar anúncio",
    publishing:         "Publicando...",
    errorDefault:       "Erro ao criar produto",
    emptyTitle:         "Nenhum produto encontrado",
    emptySubtitle:      "Seja o primeiro a anunciar nesta categoria!",
    featured:           "Destaque",
    inStock:            "Em estoque",
    remaining:          (n: number) => `${n} restantes`,
    outOfStock:         "Esgotado",
    perUnit:            (u: string) => `por ${u}`,
    addToCart:          "Adicionar ao carrinho",
    added:              "✓ Adicionado!",
    categories: {
      ALL:          "Todos",
      FERTILIZANTE: "Fertilizantes",
      SEMENTE:      "Sementes",
      DEFENSIVO:    "Defensivos",
      MAQUINA:      "Máquinas",
      FERRAMENTA:   "Ferramentas",
      SERVICO:      "Serviços",
      INOCULANTE:   "Inoculantes",
      IMPLEMENTO:   "Implementos",
      IRRIGACAO:    "Irrigação",
      OUTRO:        "Outro",
    },
  },
  en: {
    pageTitle:          "Agricultural Marketplace",
    pageSubtitle:       "Inputs, seeds and machinery for your farm",
    advertise:          "List product",
    cart:               "Cart",
    searchPlaceholder:  "Search products, brands, categories...",
    modalTitle:         "List product",
    labelName:          "Product name *",
    labelCategory:      "Category *",
    labelUnit:          "Unit *",
    labelPrice:         "Price (R$) *",
    labelStock:         "Stock (qty)",
    labelBrand:         "Brand",
    labelState:         "State (UF)",
    labelDescription:   "Description",
    placeholderName:    "E.g.: Urea 45% N",
    placeholderUnit:    "50 kg bag / L / unit",
    placeholderBrand:   "Product brand",
    placeholderState:   "MG",
    placeholderDesc:    "Describe the product...",
    cancel:             "Cancel",
    publish:            "Publish listing",
    publishing:         "Publishing...",
    errorDefault:       "Error creating product",
    emptyTitle:         "No products found",
    emptySubtitle:      "Be the first to list in this category!",
    featured:           "Featured",
    inStock:            "In stock",
    remaining:          (n: number) => `${n} remaining`,
    outOfStock:         "Out of stock",
    perUnit:            (u: string) => `per ${u}`,
    addToCart:          "Add to cart",
    added:              "✓ Added!",
    categories: {
      ALL:          "All",
      FERTILIZANTE: "Fertilizers",
      SEMENTE:      "Seeds",
      DEFENSIVO:    "Pesticides",
      MAQUINA:      "Machinery",
      FERRAMENTA:   "Tools",
      SERVICO:      "Services",
      INOCULANTE:   "Inoculants",
      IMPLEMENTO:   "Implements",
      IRRIGACAO:    "Irrigation",
      OUTRO:        "Other",
    },
  },
}

const CATEGORY_TABS = [
  { id: "ALL",          icon: Package },
  { id: "FERTILIZANTE", icon: Beaker },
  { id: "SEMENTE",      icon: Leaf },
  { id: "DEFENSIVO",    icon: Droplets },
  { id: "MAQUINA",      icon: Tractor },
  { id: "FERRAMENTA",   icon: Wrench },
  { id: "SERVICO",      icon: Package },
]

const CAT_EMOJI: Record<string, string> = {
  FERTILIZANTE: "🧪", SEMENTE: "🌱", DEFENSIVO: "💧",
  MAQUINA: "🚜", IMPLEMENTO: "⚙️", FERRAMENTA: "🔧",
  IRRIGACAO: "💦", SERVICO: "🤝", INOCULANTE: "🦠", OUTRO: "📦",
}

function fmt(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

type Product = {
  id: string; name: string; description?: string; category: string
  price: number; unit: string; stock: number; brand?: string
  state?: string; city?: string; isFeatured: boolean; images: string[]
}

const EMPTY_FORM = { name: "", description: "", category: "FERTILIZANTE", price: "", unit: "sc 50kg", stock: "", brand: "", state: "", city: "" }

export default function MarketplacePage() {
  const { lang } = useLang()
  const t = T[lang]

  const [products, setProducts]   = useState<Product[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState("")
  const [category, setCategory]   = useState("ALL")
  const [cart, setCart]           = useState<string[]>([])
  const [showNew, setShowNew]     = useState(false)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { limit: 50 }
      if (category !== "ALL") params.category = category
      if (search)             params.search   = search
      const { data } = await api.get("/marketplace/products", { params })
      setProducts(data.products ?? [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [category, search])

  useEffect(() => { load() }, [load])

  function addToCart(id: string) {
    setCart(c => [...c, id])
    setTimeout(() => setCart(c => c.filter(i => i !== id)), 2000)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError("")
    try {
      await api.post("/marketplace/products", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      })
      setForm(EMPTY_FORM)
      setShowNew(false)
      load()
    } catch (err: any) {
      setError(err.response?.data?.message ?? t.errorDefault)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header title="Marketplace" />

      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">{t.pageTitle}</h1>
            <p className="text-gray-500 text-sm mt-0.5">{t.pageSubtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={() => setShowNew(true)}>
              <Plus className="w-4 h-4" /> {t.advertise}
            </Button>
            <div className="relative">
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
              <Button variant="outline" className="gap-2">
                <ShoppingCart className="w-4 h-4" /> {t.cart}
              </Button>
            </div>
          </div>
        </div>

        {/* Modal novo produto */}
        {showNew && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-black text-gray-900">{t.modalTitle}</h2>
                <button onClick={() => setShowNew(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <form onSubmit={handleCreate} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">{t.labelName}</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder={t.placeholderName} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">{t.labelCategory}</label>
                    <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                      {(["FERTILIZANTE","DEFENSIVO","SEMENTE","INOCULANTE","MAQUINA","IMPLEMENTO","FERRAMENTA","IRRIGACAO","SERVICO","OUTRO"] as const).map(c => (
                        <option key={c} value={c}>{t.categories[c]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">{t.labelUnit}</label>
                    <input required value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder={t.placeholderUnit} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">{t.labelPrice}</label>
                    <input required type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="189.90" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">{t.labelStock}</label>
                    <input type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="100" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">{t.labelBrand}</label>
                    <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder={t.placeholderBrand} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">{t.labelState}</label>
                    <input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder={t.placeholderState} maxLength={2} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">{t.labelDescription}</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      placeholder={t.placeholderDesc} />
                  </div>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowNew(false)}>{t.cancel}</Button>
                  <Button type="submit" className="flex-1" disabled={saving}>
                    {saving ? t.publishing : t.publish}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {CATEGORY_TABS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCategory(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                category === id
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" /> {t.categories[id as keyof typeof t.categories]}
            </button>
          ))}
        </div>

        {/* Products */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="font-bold text-gray-900 mb-2">{t.emptyTitle}</p>
            <p className="text-sm text-gray-500 mb-6">{t.emptySubtitle}</p>
            <Button onClick={() => setShowNew(true)} className="gap-2">
              <Plus className="w-4 h-4" /> {t.advertise}
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {products.map(product => {
              const inCart = cart.includes(product.id)
              const stockLabel =
                product.stock > 100 ? t.inStock
                : product.stock > 0  ? t.remaining(product.stock)
                : t.outOfStock
              return (
                <Card key={product.id} className="hover:shadow-lg transition-all">
                  <CardContent className="p-0">
                    <div className="h-40 bg-gradient-to-br from-green-50 to-emerald-100 rounded-t-2xl flex items-center justify-center relative">
                      <span className="text-5xl">{CAT_EMOJI[product.category] ?? "📦"}</span>
                      {product.isFeatured && (
                        <div className="absolute top-3 left-3">
                          <Badge variant="default">{t.featured}</Badge>
                        </div>
                      )}
                      {product.state && (
                        <div className="absolute top-3 right-3 bg-white/80 rounded-full px-2 py-0.5 text-xs font-bold text-gray-600">
                          📍 {product.state}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-400 font-medium mb-1">{product.category}{product.brand ? ` · ${product.brand}` : ""}</p>
                      <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
                      {product.description && (
                        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
                      )}
                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <p className="text-xl font-black text-gray-900">{fmt(product.price)}</p>
                          <p className="text-xs text-gray-400">{t.perUnit(product.unit)}</p>
                        </div>
                        <p className={`text-xs font-semibold ${product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-amber-500" : "text-red-500"}`}>
                          {stockLabel}
                        </p>
                      </div>
                      <Button
                        className="w-full gap-2"
                        variant={inCart ? "secondary" : "default"}
                        onClick={() => addToCart(product.id)}
                        disabled={product.stock === 0}
                      >
                        {inCart ? t.added : <><ShoppingCart className="w-4 h-4" /> {t.addToCart}</>}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
