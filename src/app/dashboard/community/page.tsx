"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { api } from "@/services/api"
import { authService } from "@/services/auth.service"
import { formatDate } from "@/lib/utils"
import { Heart, MessageCircle, Share2, Plus, AlertTriangle, Lightbulb, Users, TrendingUp, X } from "lucide-react"

const POST_TYPES = [
  { id: "ALL", label: "Todos" },
  { id: "ALERT", label: "🚨 Alertas" },
  { id: "TIP", label: "💡 Dicas" },
  { id: "QUESTION", label: "❓ Perguntas" },
  { id: "TRADE", label: "🤝 Permutas" },
]

// Mock posts for demo
const MOCK_POSTS = [
  {
    id: "1", type: "ALERT", title: "Ferrugem asiática detectada em Sorriso-MT",
    content: "Confirmado foco de ferrugem asiática em talhões no km 80 da BR-163. Aparecimento de pústulas amareladas na face inferior das folhas. Apliquem fungicida preventivo se ainda não fizeram. Imagens do satélite já mostram queda no NDVI nas áreas afetadas.",
    author: { name: "João Silva", state: "MT" }, createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    likes: 47, comments: 23, tags: ["ferrugem", "soja", "MT"]
  },
  {
    id: "2", type: "TIP", title: "Economia de 30% no defensivo com aplicação VRA",
    content: "Depois de usar o diagnóstico por satélite do SolFarm, consegui identificar exatamente quais zonas precisavam de defensivo. Reduzi a aplicação em 30% sem perder produtividade. O mapa de zonas NDVI foi fundamental para a decisão.",
    author: { name: "Maria Oliveira", state: "GO" }, createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    likes: 89, comments: 31, tags: ["VRA", "economia", "defensivo"]
  },
  {
    id: "3", type: "QUESTION", title: "Como calcular dose de gesso para solos de Cerrado?",
    content: "Minha área tem pH 5.2 e alumínio tóxico de 1.8 cmolc/dm³. Qual a dose de gesso agrícola recomendada? Quem tem experiência com correção de solos no Cerrado mato-grossense?",
    author: { name: "Pedro Costa", state: "MT" }, createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    likes: 12, comments: 18, tags: ["solo", "gesso", "cerrado"]
  },
  {
    id: "4", type: "TRADE", title: "Troca: Soja semente TMG 7062 por milho DKB",
    content: "Tenho 200 sacas de soja semente TMG 7062 IPRO e quero trocar por milho DKB 390 ou similar. Estou em Lucas do Rio Verde, posso negociar frete. Quem tiver interesse fale no WhatsApp.",
    author: { name: "Carlos Mendes", state: "MT" }, createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    likes: 8, comments: 5, tags: ["permuta", "soja", "milho"]
  },
  {
    id: "5", type: "TIP", title: "Inoculante + Co-inoculante: como aplicar corretamente",
    content: "Pessoal, uma dica valiosa: nunca misture inoculante com fungicida na mesma calda. A maioria dos fungicidas mata as bactérias do inoculante. Aplique o inoculante no sulco de semeadura separado. Nossa produção aumentou 8% com esse cuidado simples.",
    author: { name: "Ana Paula Lima", state: "PR" }, createdAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
    likes: 134, comments: 44, tags: ["inoculante", "soja", "dica"]
  },
]

function typeConfig(type: string) {
  switch (type) {
    case "ALERT": return { color: "bg-red-50 text-red-700 border-red-200", icon: "🚨", label: "Alerta" }
    case "TIP": return { color: "bg-green-50 text-green-700 border-green-200", icon: "💡", label: "Dica" }
    case "QUESTION": return { color: "bg-blue-50 text-blue-700 border-blue-200", icon: "❓", label: "Pergunta" }
    case "TRADE": return { color: "bg-amber-50 text-amber-700 border-amber-200", icon: "🤝", label: "Permuta" }
    default: return { color: "bg-gray-50 text-gray-700 border-gray-200", icon: "📝", label: "Post" }
  }
}

export default function CommunityPage() {
  const [posts, setPosts] = useState(MOCK_POSTS)
  const [filter, setFilter] = useState("ALL")
  const [liked, setLiked] = useState<string[]>([])
  const [showNew, setShowNew] = useState(false)
  const [newPost, setNewPost] = useState({ title: "", content: "", type: "TIP" })
  const [user] = useState(() => authService.getStoredUser())

  const filtered = filter === "ALL" ? posts : posts.filter(p => p.type === filter)

  function toggleLike(id: string) {
    setLiked(l => l.includes(id) ? l.filter(i => i !== id) : [...l, id])
  }

  function submitPost() {
    if (!newPost.title || !newPost.content) return
    const post = {
      id: Date.now().toString(),
      type: newPost.type,
      title: newPost.title,
      content: newPost.content,
      author: { name: user?.name ?? "Você", state: user?.state ?? "BR" },
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      tags: [],
    }
    setPosts(p => [post, ...p])
    setNewPost({ title: "", content: "", type: "TIP" })
    setShowNew(false)
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}min atrás`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h atrás`
    return `${Math.floor(hrs / 24)}d atrás`
  }

  return (
    <div className="min-h-screen">
      <Header title="Comunidade" />

      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Rede de Produtores</h1>
            <p className="text-gray-500 text-sm mt-0.5">Compartilhe alertas, dicas e faça permutas</p>
          </div>
          <Button className="gap-2" onClick={() => setShowNew(true)}>
            <Plus className="w-4 h-4" /> Nova publicação
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Users, label: "Produtores ativos", value: "12.847", color: "green" },
            { icon: TrendingUp, label: "Posts esta semana", value: "1.293", color: "blue" },
            { icon: Share2, label: "Estados conectados", value: "24", color: "amber" },
          ].map(({ icon: Icon, label, value, color }) => (
            <Card key={label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-${color}-50 flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${color}-600`} />
                </div>
                <div>
                  <p className="text-xl font-black text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Feed */}
          <div className="lg:col-span-2">
            {/* Filter tabs */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {POST_TYPES.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setFilter(id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                    filter === id ? "bg-green-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* New post form */}
            {showNew && (
              <Card className="mb-5 border-green-200">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Nova publicação</h3>
                    <button onClick={() => setShowNew(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Type selector */}
                  <div className="flex gap-2 mb-4">
                    {[["TIP","💡","Dica"],["ALERT","🚨","Alerta"],["QUESTION","❓","Pergunta"],["TRADE","🤝","Permuta"]].map(([val, emoji, label]) => (
                      <button
                        key={val}
                        onClick={() => setNewPost(p => ({ ...p, type: val }))}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          newPost.type === val ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-600"
                        }`}
                      >
                        {emoji} {label}
                      </button>
                    ))}
                  </div>

                  <input
                    value={newPost.title}
                    onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                    placeholder="Título da publicação"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 mb-3 text-gray-900"
                  />
                  <textarea
                    value={newPost.content}
                    onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
                    placeholder="Escreva sua mensagem para a comunidade..."
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 mb-4 resize-none text-gray-900"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
                    <Button onClick={submitPost} disabled={!newPost.title || !newPost.content}>Publicar</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts */}
            <div className="space-y-4">
              {filtered.map(post => {
                const cfg = typeConfig(post.type)
                const isLiked = liked.includes(post.id)
                return (
                  <Card key={post.id} className="hover:shadow-md transition-all">
                    <CardContent className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center font-bold text-green-700 text-sm">
                            {post.author.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{post.author.name}</p>
                            <p className="text-xs text-gray-400">📍 {post.author.state} · {timeAgo(post.createdAt)}</p>
                          </div>
                        </div>
                        <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>
                          {cfg.icon} {cfg.label}
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="font-bold text-gray-900 mb-2">{post.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">{post.content}</p>

                      {/* Tags */}
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {post.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                            isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
                          }`}
                        >
                          <Heart className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
                          {post.likes + (isLiked ? 1 : 0)}
                        </button>
                        <button className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-blue-500 transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments}
                        </button>
                        <button className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-green-500 transition-colors ml-auto">
                          <Share2 className="w-4 h-4" />
                          Compartilhar
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <Card>
              <CardHeader><CardTitle className="text-base">🌡️ Alertas Ativos</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { region: "MT Norte", issue: "Ferrugem asiática", severity: "ALTA", color: "#ef4444" },
                  { region: "GO Sul", issue: "Seca prolongada", severity: "MÉDIA", color: "#f97316" },
                  { region: "PR Oeste", issue: "Geada tardia", severity: "BAIXA", color: "#eab308" },
                ].map((alert, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-red-50">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-red-800">{alert.region}</p>
                      <p className="text-xs text-red-600">{alert.issue}</p>
                    </div>
                    <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: alert.color }}>
                      {alert.severity}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">💡 Dicas em Alta</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Aplique inoculante separado do fungicida",
                  "Análise de solo antes da semeadura",
                  "Monitoramento semanal de doenças",
                  "VRA reduz custo em até 30%",
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-green-500 font-bold text-sm mt-0.5">#{i + 1}</span>
                    <p className="text-sm text-gray-600">{tip}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
