import Link from "next/link"
import { Leaf, Satellite, ShoppingCart, Users, BarChart3, ArrowRight, CheckCircle, Star, ChevronRight, Map, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black">
              <span className="text-gray-900">Sol</span>
              <span className="text-green-600">Farm</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-green-600 font-medium transition-colors">Funcionalidades</a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-green-600 font-medium transition-colors">Como funciona</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-green-600 font-medium transition-colors">Planos</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-green-600 transition-colors">Entrar</Link>
            <Link href="/register">
              <Button size="sm">Começar grátis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 -z-10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-green-100/40 blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs font-bold px-4 py-2 rounded-full mb-6">
                <Zap className="w-3 h-3" />
                🛰 Diagnóstico via Satélite Sentinel-2 — GRATUITO
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
                Sua lavoura vista
                <span className="text-green-600 block">do espaço.</span>
                Decisões na palma da mão.
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed mb-8 max-w-xl">
                A SolFarm usa imagens de satélite gratuitas para diagnosticar sua área em tempo real, recomendar culturas e otimizar fertilizantes — reduzindo custos em até 30%.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Começar grátis agora <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Ver demonstração
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {["Sem cartão de crédito", "1 área grátis para sempre", "Setup em 2 minutos"].map(t => (
                  <div key={t} className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Card demo */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-green-700 to-green-500 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-green-200 text-sm font-medium">Fazenda Bom Futuro — Talhão 1</p>
                      <p className="text-white text-xs mt-1">450 ha · Soja · Cerrado/MT</p>
                    </div>
                    <div className="text-center bg-white/20 rounded-2xl px-4 py-2">
                      <p className="text-3xl font-black text-white">7.4</p>
                      <p className="text-green-200 text-xs">/10</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="text-white text-sm font-semibold">🟡 Bom — Monitoramento recomendado</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
                  {[["NDVI", "0.542", "Vegetação"], ["NDRE", "0.183", "Nitrogênio"], ["NDWI", "-0.04", "Umidade"]].map(([l, v, d]) => (
                    <div key={l} className="p-4 text-center">
                      <p className="text-xs text-gray-400 font-semibold mb-1">{l}</p>
                      <p className="text-xl font-black text-gray-900">{v}</p>
                      <p className="text-xs text-gray-400 mt-1">{d}</p>
                    </div>
                  ))}
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Mapa de calor por zona</p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      [0.72,"EXCELENTE"],[0.54,"BOM"],[0.41,"REGULAR"],
                      [0.61,"BOM"],[0.38,"REGULAR"],[0.71,"EXCELENTE"],
                      [0.18,"CRÍTICO"],[0.59,"BOM"],[0.67,"BOM"],
                    ].map(([v, s], i) => (
                      <div key={i} className="rounded-xl p-2 text-center" style={{ backgroundColor: ndviBg(v as number) }}>
                        <p className="text-xs font-black" style={{ color: ndviColorStr(v as number) }}>{(v as number).toFixed(2)}</p>
                        <p className="text-[9px] text-gray-500 mt-0.5">{s}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <p className="text-xs font-bold text-amber-800">⚠️ Zona Z31 — NDVI crítico (0.18)</p>
                    <p className="text-xs text-amber-700 mt-1">Aplicar 80 kg N/ha. Verificar estande e pragas.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-green-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[["12.000+","Produtores cadastrados"],["2.4M","Hectares monitorados"],["98.7%","Precisão do diagnóstico"],["30%","Redução de custos"]].map(([v, l]) => (
              <div key={l}>
                <p className="text-4xl font-black text-white">{v}</p>
                <p className="text-green-200 text-sm mt-2 font-medium">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-green-600 text-sm font-bold uppercase tracking-widest mb-3">Funcionalidades</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Tudo que o grande produtor tinha.<br/>Agora para você.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Satellite, title: "Diagnóstico via Satélite", desc: "Imagens Sentinel-2 gratuitas, revisita a cada 5 dias. NDVI, NDRE e NDWI calculados automaticamente.", tags: ["NDVI","NDRE","NDWI"] },
              { icon: BarChart3, title: "Fertilização por Zona (VRA)", desc: "IA divide sua área em zonas e recomenda dose exata de NPK. Economize até 30% em fertilizantes.", tags: ["Nitrogênio","Fósforo","Potássio"] },
              { icon: Map, title: "Mapeamento Geoespacial", desc: "Desenhe o polígono da lavoura. O sistema calcula hectares e conecta com bases de dados regionais.", tags: ["PostGIS","GeoJSON"] },
              { icon: ShoppingCart, title: "Marketplace Integrado", desc: "Compre fertilizantes e defensivos direto no diagnóstico. Produto certo, menor preço da sua região.", tags: ["Insumos","Sementes","Máquinas"] },
              { icon: Users, title: "Rede de Produtores", desc: "Conecte-se com produtores da sua região. Alertas de pragas, resultados e compras coletivas.", tags: ["Alertas","Dicas","Compras"] },
              { icon: Shield, title: "Score Agrícola", desc: "Score da sua propriedade para crédito rural e seguro paramétrico por satélite.", tags: ["Crédito","Seguro"] },
            ].map(({ icon: Icon, title, desc, tags }) => (
              <div key={title} className="group p-6 rounded-2xl border border-gray-200 hover:border-green-200 hover:shadow-lg transition-all bg-white">
                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{desc}</p>
                <div className="flex flex-wrap gap-2">
                  {tags.map(t => <span key={t} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-medium">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-green-600 text-sm font-bold uppercase tracking-widest mb-3">Como funciona</p>
            <h2 className="text-4xl font-black text-gray-900">Do cadastro ao diagnóstico em minutos</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "01", icon: "📱", title: "Cadastre-se", desc: "Conta grátis em 2 minutos. Sem cartão." },
              { step: "02", icon: "🗺️", title: "Mapeie sua área", desc: "Desenhe o polígono da lavoura no mapa." },
              { step: "03", icon: "🛰️", title: "Satélite analisa", desc: "Imagem Sentinel-2 processada automaticamente." },
              { step: "04", icon: "📊", title: "Receba diagnóstico", desc: "NDVI, plano VRA e culturas recomendadas." },
            ].map(({ step, icon, title, desc }, i) => (
              <div key={step} className="relative text-center">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-green-100 flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">{icon}</div>
                {i < 3 && <div className="absolute top-6 left-[calc(50%+36px)] hidden md:block"><ChevronRight className="w-5 h-5 text-gray-300" /></div>}
                <p className="text-xs font-bold text-green-600 mb-2">PASSO {step}</p>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-green-600 text-sm font-bold uppercase tracking-widest mb-3">Planos</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">Preço justo para cada tamanho de fazenda</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name:"Grátis", price:"R$ 0", period:"/sempre", highlight:false, features:["1 área cadastrada","Diagnóstico NDVI básico","Histórico 30 dias","Marketplace (visualização)"] },
              { name:"Campo", price:"R$ 49", period:"/mês", highlight:true, features:["Até 5 áreas","NDVI + NDRE + NDWI","Plano VRA de fertilização","Marketplace com compra","Alertas automáticos","Histórico 12 meses"] },
              { name:"Fazenda", price:"R$ 149", period:"/mês", highlight:false, features:["Áreas ilimitadas","IA avançada","Score agrícola + crédito","API para integração","Relatórios PDF","Gerente dedicado"] },
            ].map(({ name, price, period, highlight, features }) => (
              <div key={name} className={`rounded-3xl p-8 border-2 relative ${highlight ? "border-green-500 shadow-2xl scale-105" : "border-gray-200"}`}>
                {highlight && <div className="absolute -top-4 left-1/2 -translate-x-1/2"><span className="bg-green-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">MAIS POPULAR</span></div>}
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">{name}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-gray-900">{price}</span>
                  <span className="text-gray-400 text-sm">{period}</span>
                </div>
                <Link href="/register" className="block mb-8">
                  <Button className="w-full" variant={highlight ? "default" : "outline"}>
                    {name === "Grátis" ? "Começar grátis" : `Assinar ${name}`}
                  </Button>
                </Link>
                <ul className="space-y-3">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-green-700 to-green-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">Sua lavoura merece<br/>tecnologia de ponta.</h2>
          <p className="text-xl text-green-200 mb-10 max-w-xl mx-auto">Junte-se a mais de 12.000 produtores que já usam satélite para tomar decisões mais inteligentes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 gap-2 font-black">
                Criar conta grátis <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" className="text-white border-2 border-white/40 bg-transparent hover:bg-white/10">
                Já tenho conta
              </Button>
            </Link>
          </div>
          <p className="text-green-300 text-sm mt-6">Sem cartão de crédito · 1 área grátis · Cancele quando quiser</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-green-600 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black text-white">Sol<span className="text-green-400">Farm</span></span>
            <span className="text-gray-600 ml-3 text-sm">solfarm.com.br</span>
          </div>
          <div className="flex gap-6 text-sm">
            {["Termos de Uso","Privacidade","Contato","API"].map(t => <a key={t} href="#" className="hover:text-white transition-colors">{t}</a>)}
          </div>
          <p className="text-xs text-gray-600">© 2025 SolFarm · Feito com 🌱 para o produtor brasileiro</p>
        </div>
      </footer>
    </div>
  )
}

function ndviColorStr(v: number) {
  if (v > 0.7) return "#15803d"
  if (v > 0.5) return "#65a30d"
  if (v > 0.3) return "#ca8a04"
  return "#dc2626"
}
function ndviBg(v: number) {
  if (v > 0.7) return "#f0fdf4"
  if (v > 0.5) return "#f7fee7"
  if (v > 0.3) return "#fefce8"
  return "#fef2f2"
}
