"use client"

import { useEffect, useState, useCallback } from "react"
import { Header } from "@/components/layout/Header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/services/api"
import { Search, ShoppingCart, Package, Beaker, Leaf, Droplets, Tractor, Wrench, Plus, X } from "lucide-react"

const CATEGORIES = [
  { id: "ALL",          label: "Todos",         icon: Package },
  { id: "FERTILIZANTE", label: "Fertilizantes", icon: Beaker },
  { id: "SEMENTE",      label: "Sementes",      icon: Leaf },
  { id: "DEFENSIVO",    label: "Defensivos",    icon: Droplets },
  { id: "MAQUINA",      label: "Máquinas",      icon: Tractor },
  { id: "FERRAMENTA",   label: "Ferramentas",   icon: Wrench },
  { id: "SERVICO",      label: "Serviços",      icon: Package },
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
      setError(err.response?.data?.message ?? "Erro ao criar produto")
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
            <h1 className="text-2xl font-black text-gray-900">Marketplace Agrícola</h1>
            <p className="text-gray-500 text-sm mt-0.5">Insumos, sementes e máquinas para sua lavoura</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2" onClick={() => setShowNew(true)}>
              <Plus className="w-4 h-4" /> Anunciar produto
            </Button>
            <div className="relative">
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
              <Button variant="outline" className="gap-2">
                <ShoppingCart className="w-4 h-4" /> Carrinho
              </Button>
            </div>
          </div>
        </div>

        {/* Modal novo produto */}
        {showNew && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-black text-gray-900">Anunciar produto</h2>
                <button onClick={() => setShowNew(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <form onSubmit={handleCreate} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Nome do produto *</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: Ureia 45% N" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Categoria *</label>
                    <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                      {["FERTILIZANTE","DEFENSIVO","SEMENTE","INOCULANTE","MAQUINA","IMPLEMENTO","FERRAMENTA","IRRIGACAO","SERVICO","OUTRO"].map(c => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Unidade *</label>
                    <input required value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="sc 50kg / L / un" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Preço (R$) *</label>
                    <input required type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="189.90" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Estoque (qtd)</label>
                    <input type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="100" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Marca</label>
                    <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Marca do produto" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Estado (UF)</label>
                    <input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="MG" maxLength={2} />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Descrição</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      placeholder="Descreva o produto..." />
                  </div>
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowNew(false)}>Cancelar</Button>
                  <Button type="submit" className="flex-1" disabled={saving}>
                    {saving ? "Publicando..." : "Publicar anúncio"}
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
            placeholder="Buscar produtos, marcas, categorias..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {CATEGORIES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCategory(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                category === id
                  ? "bg-green-600 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
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
            <p className="font-bold text-gray-900 mb-2">Nenhum produto encontrado</p>
            <p className="text-sm text-gray-500 mb-6">Seja o primeiro a anunciar nesta categoria!</p>
            <Button onClick={() => setShowNew(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Anunciar produto
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {products.map(product => {
              const inCart = cart.includes(product.id)
              return (
                <Card key={product.id} className="hover:shadow-lg transition-all">
                  <CardContent className="p-0">
                    <div className="h-40 bg-gradient-to-br from-green-50 to-emerald-100 rounded-t-2xl flex items-center justify-center relative">
                      <span className="text-5xl">{CAT_EMOJI[product.category] ?? "📦"}</span>
                      {product.isFeatured && (
                        <div className="absolute top-3 left-3">
                          <Badge variant="default">Destaque</Badge>
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
                          <p className="text-xs text-gray-400">por {product.unit}</p>
                        </div>
                        <p className={`text-xs font-semibold ${product.stock > 10 ? "text-green-600" : product.stock > 0 ? "text-amber-500" : "text-red-500"}`}>
                          {product.stock > 100 ? "Em estoque" : product.stock > 0 ? `${product.stock} restantes` : "Esgotado"}
                        </p>
                      </div>
                      <Button
                        className="w-full gap-2"
                        variant={inCart ? "secondary" : "default"}
                        onClick={() => addToCart(product.id)}
                        disabled={product.stock === 0}
                      >
                        {inCart ? "✓ Adicionado!" : <><ShoppingCart className="w-4 h-4" /> Adicionar ao carrinho</>}
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
