"use client"

import { useEffect, useState, useCallback } from "react"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/services/api"
import { Heart, MessageCircle, Share2, Plus, AlertTriangle, Users, TrendingUp, X, RefreshCw } from "lucide-react"

const POST_TYPES = [
  { id: "TODOS",     label: "Todos" },
  { id: "ALERTA",   label: "🚨 Alertas" },
  { id: "DICA",     label: "💡 Dicas" },
  { id: "DUVIDA",   label: "❓ Perguntas" },
  { id: "VENDA",    label: "🤝 Ofertas" },
  { id: "RESULTADO",label: "📊 Resultados" },
]

function catConfig(cat: string) {
  switch (cat) {
    case "ALERTA":    return { color: "bg-red-50 text-red-700 border-red-200",     icon: "🚨", label: "Alerta" }
    case "DICA":      return { color: "bg-green-50 text-green-700 border-green-200", icon: "💡", label: "Dica" }
    case "DUVIDA":    return { color: "bg-blue-50 text-blue-700 border-blue-200",   icon: "❓", label: "Pergunta" }
    case "VENDA":     return { color: "bg-amber-50 text-amber-700 border-amber-200", icon: "🤝", label: "Oferta" }
    case "RESULTADO": return { color: "bg-purple-50 text-purple-700 border-purple-200", icon: "📊", label: "Resultado" }
    default:          return { color: "bg-gray-50 text-gray-700 border-gray-200",   icon: "📝", label: "Post" }
  }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "agora"
  if (mins < 60) return `${mins}min atrás`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h atrás`
  return `${Math.floor(hrs / 24)}d atrás`
}

type Post = {
  id: string; title?: string; content: string; category: string
  likes: number; createdAt: string; state?: string; city?: string
  user: { id: string; name: string; state?: string; city?: string; plan: string }
}

export default function CommunityPage() {
  const [posts, setPosts]       = useState<Post[]>([])
  const [stats, setStats]       = useState({ totalUsers: 0, totalPosts: 0, recentPosts: 0 })
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState("TODOS")
  const [liked, setLiked]       = useState<string[]>([])
  const [showNew, setShowNew]   = useState(false)
  const [newPost, setNewPost]   = useState({ title: "", content: "", category: "DICA" })
  const [posting, setPosting]   = useState(false)
  const [postError, setPostError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { limit: 30 }
      if (filter !== "TODOS") params.category = filter
      const [postsRes, statsRes] = await Promise.allSettled([
        api.get("/community/posts", { params }),
        api.get("/community/stats"),
      ])
      if (postsRes.status === "fulfilled") setPosts(postsRes.value.data.posts ?? [])
      if (statsRes.status === "fulfilled") setStats(statsRes.value.data)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { load() }, [load])

  async function toggleLike(postId: string) {
    if (liked.includes(postId)) return
    setLiked(l => [...l, postId])
    setPosts(p => p.map(x => x.id === postId ? { ...x, likes: x.likes + 1 } : x))
    try { await api.post(`/community/posts/${postId}/like`) } catch {}
  }

  async function submitPost() {
    if (!newPost.content.trim()) return
    setPosting(true); setPostError("")
    try {
      const { data } = await api.post("/community/posts", newPost)
      setPosts(p => [data, ...p])
      setNewPost({ title: "", content: "", category: "DICA" })
      setShowNew(false)
    } catch (err: any) {
      setPostError(err.response?.data?.message ?? "Erro ao publicar")
    } finally {
      setPosting(false)
    }
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
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={load} className="gap-2">
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            <Button className="gap-2" onClick={() => setShowNew(true)}>
              <Plus className="w-4 h-4" /> Nova publicação
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: Users,       label: "Produtores ativos",  value: stats.totalUsers  > 0 ? stats.totalUsers.toLocaleString("pt-BR")  : "—" },
            { icon: TrendingUp,  label: "Posts esta semana",  value: stats.recentPosts > 0 ? stats.recentPosts.toLocaleString("pt-BR") : "—" },
            { icon: MessageCircle, label: "Total de posts",   value: stats.totalPosts  > 0 ? stats.totalPosts.toLocaleString("pt-BR")  : "—" },
          ].map(({ icon: Icon, label, value }) => (
            <Card key={label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-green-600" />
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
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {[["DICA","💡","Dica"],["ALERTA","🚨","Alerta"],["DUVIDA","❓","Pergunta"],["VENDA","🤝","Oferta"],["RESULTADO","📊","Resultado"]].map(([val, emoji, label]) => (
                      <button
                        key={val}
                        onClick={() => setNewPost(p => ({ ...p, category: val }))}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          newPost.category === val ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 text-gray-600"
                        }`}
                      >
                        {emoji} {label}
                      </button>
                    ))}
                  </div>
                  <input
                    value={newPost.title}
                    onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))}
                    placeholder="Título (opcional)"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 mb-3 text-gray-900"
                  />
                  <textarea
                    value={newPost.content}
                    onChange={e => setNewPost(p => ({ ...p, content: e.target.value }))}
                    placeholder="Escreva sua mensagem para a comunidade..."
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 mb-4 resize-none text-gray-900"
                  />
                  {postError && <p className="text-sm text-red-600 mb-3">{postError}</p>}
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowNew(false)}>Cancelar</Button>
                    <Button onClick={submitPost} disabled={!newPost.content.trim() || posting}>
                      {posting ? "Publicando..." : "Publicar"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-20">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="font-bold text-gray-900 mb-2">Nenhuma publicação ainda</p>
                <p className="text-sm text-gray-500 mb-6">Seja o primeiro a publicar na comunidade!</p>
                <Button onClick={() => setShowNew(true)} className="gap-2">
                  <Plus className="w-4 h-4" /> Criar publicação
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map(post => {
                  const cfg = catConfig(post.category)
                  const isLiked = liked.includes(post.id)
                  const initials = post.user.name.split(" ").map(n => n[0]).slice(0, 2).join("")
                  const location = post.user.state ? `📍 ${post.user.city ? `${post.user.city}/${post.user.state}` : post.user.state}` : ""
                  return (
                    <Card key={post.id} className="hover:shadow-md transition-all">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center font-bold text-green-700 text-sm">
                              {initials}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{post.user.name}</p>
                              <p className="text-xs text-gray-400">{location} · {timeAgo(post.createdAt)}</p>
                            </div>
                          </div>
                          <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>
                            {cfg.icon} {cfg.label}
                          </div>
                        </div>
                        {post.title && <h3 className="font-bold text-gray-900 mb-2">{post.title}</h3>}
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">{post.content}</p>
                        <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => toggleLike(post.id)}
                            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                              isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"
                            }`}
                          >
                            <Heart className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-1.5 text-sm font-medium text-gray-400 hover:text-green-500 transition-colors ml-auto">
                            <Share2 className="w-4 h-4" /> Compartilhar
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <Card>
              <CardHeader><CardTitle className="text-base">🌡️ Alertas Ativos</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {[
                  { region: "MT Norte",  issue: "Ferrugem asiática", color: "#ef4444" },
                  { region: "GO Sul",    issue: "Seca prolongada",   color: "#f97316" },
                  { region: "PR Oeste",  issue: "Geada tardia",      color: "#eab308" },
                ].map((alert, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-red-50">
                    <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-red-800">{alert.region}</p>
                      <p className="text-xs text-red-600">{alert.issue}</p>
                    </div>
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
