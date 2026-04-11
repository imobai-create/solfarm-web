"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/Header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/services/api"
import { formatCurrency } from "@/lib/utils"
import { Search, ShoppingCart, Star, Filter, Package, TrendingUp, Leaf, Droplets, Beaker } from "lucide-react"

const CATEGORIES = [
  { id: "ALL", label: "Todos", icon: Package },
  { id: "FERTILIZER", label: "Fertilizantes", icon: Beaker },
  { id: "SEED", label: "Sementes", icon: Leaf },
  { id: "PESTICIDE", label: "Defensivos", icon: Droplets },
  { id: "MACHINE", label: "Máquinas", icon: TrendingUp },
]

// Mock products for demo
const MOCK_PRODUCTS = [
  { id: "1", name: "Ureia 45%", description: "Fertilizante nitrogenado de alta concentração, ideal para aplicação em cobertura", price: 189.90, unit: "sc 50kg", category: "FERTILIZER", rating: 4.8, reviews: 234, badge: "Mais vendido", stock: 500 },
  { id: "2", name: "MAP Monoamônio Fosfato", description: "Fertilizante fosfatado para plantio, fórmula 11-52-00", price: 245.00, unit: "sc 50kg", category: "FERTILIZER", rating: 4.7, reviews: 189, badge: null, stock: 320 },
  { id: "3", name: "KCl Cloreto de Potássio", description: "Fonte de potássio concentrada para correção de solos com deficiência", price: 198.50, unit: "sc 50kg", category: "FERTILIZER", rating: 4.6, reviews: 156, badge: "VRA", stock: 410 },
  { id: "4", name: "Semente de Soja TMG 7062", description: "Variedade de alta produtividade para Cerrado, RR (Roundup Ready)", price: 420.00, unit: "sc 40kg", category: "SEED", rating: 4.9, reviews: 312, badge: "Premium", stock: 150 },
  { id: "5", name: "Semente de Milho DKB 390", description: "Híbrido simples de alta performance para safra de verão", price: 380.00, unit: "sc 60.000 sem.", category: "SEED", rating: 4.8, reviews: 267, badge: null, stock: 89 },
  { id: "6", name: "Glifosato 480 g/L", description: "Herbicida sistêmico de amplo espectro, formulação concentrado solúvel", price: 62.90, unit: "L", category: "PESTICIDE", rating: 4.5, reviews: 445, badge: "Oferta", stock: 2000 },
  { id: "7", name: "Azoxistrobina + Ciproconazol", description: "Fungicida para controle de ferrugem asiática e outras doenças foliares", price: 89.90, unit: "L", category: "PESTICIDE", rating: 4.7, reviews: 198, badge: null, stock: 340 },
  { id: "8", name: "Drone Agro DJI Agras T40", description: "Drone agrícola para pulverização de precisão, 40L de capacidade", price: 89990.00, unit: "un", category: "MACHINE", rating: 4.9, reviews: 45, badge: "Premium", stock: 8 },
]

export default function MarketplacePage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("ALL")
  const [cart, setCart] = useState<string[]>([])

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === "ALL" || p.category === category
    return matchSearch && matchCat
  })

  function addToCart(id: string) {
    setCart(c => [...c, id])
    setTimeout(() => setCart(c => c.filter(i => i !== id)), 2000)
  }

  function badgeVariant(badge: string | null) {
    if (!badge) return null
    if (badge === "Oferta") return "warning"
    if (badge === "Premium") return "info"
    if (badge === "VRA") return "secondary"
    return "default"
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
          <div className="flex items-center gap-2">
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
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="font-bold text-gray-900 mb-2">Nenhum produto encontrado</p>
            <p className="text-sm text-gray-500">Tente outros termos de busca</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {filtered.map(product => {
              const inCart = cart.includes(product.id)
              const bVariant = badgeVariant(product.badge)
              return (
                <Card key={product.id} className="hover:shadow-lg transition-all">
                  <CardContent className="p-0">
                    {/* Image placeholder */}
                    <div className="h-40 bg-gradient-to-br from-green-50 to-emerald-100 rounded-t-2xl flex items-center justify-center relative">
                      <span className="text-5xl">
                        {product.category === "FERTILIZER" ? "🧪" :
                         product.category === "SEED" ? "🌱" :
                         product.category === "PESTICIDE" ? "💧" : "🚜"}
                      </span>
                      {product.badge && bVariant && (
                        <div className="absolute top-3 left-3">
                          <Badge variant={bVariant as any}>{product.badge}</Badge>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
                      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>

                      {/* Rating */}
                      <div className="flex items-center gap-1.5 mb-3">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => (
                            <Star
                              key={s}
                              className="w-3 h-3"
                              fill={s <= Math.round(product.rating) ? "#f59e0b" : "none"}
                              stroke={s <= Math.round(product.rating) ? "#f59e0b" : "#d1d5db"}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{product.rating} ({product.reviews})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <p className="text-xl font-black text-gray-900">
                            {formatCurrency(product.price)}
                          </p>
                          <p className="text-xs text-gray-400">por {product.unit}</p>
                        </div>
                        <p className="text-xs text-green-600 font-semibold">
                          {product.stock > 100 ? "Em estoque" : product.stock > 0 ? `${product.stock} restantes` : "Esgotado"}
                        </p>
                      </div>

                      <Button
                        className="w-full gap-2"
                        variant={inCart ? "secondary" : "default"}
                        onClick={() => addToCart(product.id)}
                        disabled={product.stock === 0}
                      >
                        {inCart ? (
                          <><CheckIcon /> Adicionado!</>
                        ) : (
                          <><ShoppingCart className="w-4 h-4" /> Adicionar ao carrinho</>
                        )}
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

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
}
