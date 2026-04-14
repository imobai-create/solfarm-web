"use client"

import { useLang } from "@/hooks/useLang"
import Link from "next/link"
import { Leaf, Satellite, ShoppingCart, Users, BarChart3, ArrowRight, CheckCircle, ChevronRight, Map, Zap, Shield, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

// ─── Traduções ────────────────────────────────────────────────
const T = {
  pt: {
    nav: { features: "Funcionalidades", howItWorks: "Como funciona", pricing: "Planos", login: "Entrar", start: "Começar grátis" },
    hero: {
      badge: "🛰 Diagnóstico via Satélite Sentinel-2 — GRATUITO",
      h1a: "Sua lavoura vista",
      h1b: "do espaço.",
      h1c: "Decisões na palma da mão.",
      desc: "A SolFarm usa imagens de satélite para diagnosticar sua área em tempo real, recomendar culturas e otimizar fertilizantes — com tecnologia acessível para qualquer produtor.",
      startBtn: "Começar grátis agora",
      demoBtn: "Ver demonstração",
      badges: ["Plano grátis disponível", "1 área grátis para sempre", "Setup em 2 minutos"],
      simLabel: "🔬 Exemplo de simulação — veja como funciona",
      simFarm: "Talhão Simulado — Diagnóstico de exemplo",
      simDesc: "Ex: 120 ha · Soja · Cerrado",
      simAlert: "Zona com baixo NDVI — Aplicar N/ha conforme recomendação",
    },
    stats: [
      ["6", "Biomas cobertos"],
      ["10m", "Resolução do satélite"],
      ["5 dias", "Revisita Sentinel-2"],
      ["100%", "Território nacional"],
    ],
    features: {
      title: "Funcionalidades",
      h2: "Tudo que o grande produtor tinha.\nAgora para você.",
      items: [
        { title: "Diagnóstico via Satélite", desc: "Imagens Sentinel-2, revisita a cada 5 dias. NDVI, NDRE e NDWI calculados automaticamente.", tags: ["NDVI","NDRE","NDWI"] },
        { title: "Fertilização por Zona (VRA)", desc: "IA divide sua área em zonas e recomenda dose exata de NPK, reduzindo desperdício.", tags: ["Nitrogênio","Fósforo","Potássio"] },
        { title: "Mapeamento Geoespacial", desc: "Desenhe o polígono da lavoura. O sistema calcula hectares e conecta com dados regionais.", tags: ["PostGIS","GeoJSON"] },
        { title: "Marketplace Integrado", desc: "Compre insumos direto no diagnóstico. Produto certo, menor preço da sua região.", tags: ["Insumos","Sementes","Máquinas"] },
        { title: "Rede de Produtores", desc: "Conecte-se com produtores da sua região. Alertas de pragas e compras coletivas.", tags: ["Alertas","Dicas","Compras"] },
        { title: "Score Agrícola", desc: "Score da sua propriedade para crédito rural e seguro paramétrico por satélite.", tags: ["Crédito","Seguro"] },
      ],
    },
    howItWorks: {
      title: "Como funciona",
      h2: "Do cadastro ao diagnóstico em minutos",
      steps: [
        { icon: "📱", title: "Cadastre-se", desc: "Conta grátis em 2 minutos." },
        { icon: "🗺️", title: "Mapeie sua área", desc: "Desenhe o polígono da lavoura no mapa." },
        { icon: "🛰️", title: "Satélite analisa", desc: "Imagem Sentinel-2 processada automaticamente." },
        { icon: "📊", title: "Receba diagnóstico", desc: "NDVI, plano VRA e culturas recomendadas." },
      ],
    },
    pricing: {
      title: "Planos",
      h2: "Preço justo para cada tamanho de fazenda",
      plans: [
        { name: "Grátis", price: "R$ 0", period: "/sempre", highlight: false, features: ["1 área cadastrada","Diagnóstico NDVI básico","Histórico 30 dias","Marketplace (visualização)"] },
        { name: "Campo", price: "R$ 49", period: "/mês", highlight: true, features: ["Até 5 áreas","NDVI + NDRE + NDWI","Plano VRA de fertilização","Marketplace com compra","Alertas automáticos","Histórico 12 meses"] },
        { name: "Fazenda", price: "R$ 149", period: "/mês", highlight: false, features: ["Áreas ilimitadas","IA avançada","Score agrícola + crédito","API para integração","Relatórios PDF","Suporte dedicado"] },
      ],
      startFree: "Começar grátis",
      subscribe: "Assinar",
    },
    cta: {
      h2: "Sua lavoura merece\ntecnologia de ponta.",
      desc: "Tecnologia de satélite acessível para produtores rurais de todo o Brasil.",
      startBtn: "Criar conta grátis",
      loginBtn: "Já tenho conta",
      footer: "💳 PIX · Cartão · Boleto · Plano grátis disponível · Cancele quando quiser",
    },
    footer: { terms: "Termos de Uso", privacy: "Privacidade", contact: "Contato", api: "API", copy: "© 2026 SolFarm · Tecnologia para o produtor rural brasileiro" },
  },

  en: {
    nav: { features: "Features", howItWorks: "How it works", pricing: "Plans", login: "Login", start: "Get started free" },
    hero: {
      badge: "🛰 Sentinel-2 Satellite Diagnosis — FREE",
      h1a: "Your farmland seen",
      h1b: "from space.",
      h1c: "Smart decisions in your hands.",
      desc: "SolFarm uses satellite imagery to diagnose your fields in real time, recommend crops and optimize fertilizers — accessible technology for every farmer.",
      startBtn: "Get started for free",
      demoBtn: "View demo",
      badges: ["Free plan available", "1 area free forever", "Setup in 2 minutes"],
      simLabel: "🔬 Simulation example — see how it works",
      simFarm: "Simulated Field — Sample Diagnosis",
      simDesc: "e.g. 120 ha · Soybean · Cerrado",
      simAlert: "Low NDVI zone — Apply N/ha as recommended",
    },
    stats: [
      ["6", "Biomes covered"],
      ["10m", "Satellite resolution"],
      ["5 days", "Sentinel-2 revisit"],
      ["100%", "National territory"],
    ],
    features: {
      title: "Features",
      h2: "Enterprise-grade agtech.\nNow for every farmer.",
      items: [
        { title: "Satellite Diagnosis", desc: "Sentinel-2 imagery, revisited every 5 days. NDVI, NDRE and NDWI calculated automatically.", tags: ["NDVI","NDRE","NDWI"] },
        { title: "Zone Fertilization (VRA)", desc: "AI splits your area into zones and recommends exact NPK doses, reducing waste.", tags: ["Nitrogen","Phosphorus","Potassium"] },
        { title: "Geospatial Mapping", desc: "Draw your field polygon. The system calculates hectares and connects with regional data.", tags: ["PostGIS","GeoJSON"] },
        { title: "Integrated Marketplace", desc: "Buy inputs directly from the diagnosis. Right product, best price in your region.", tags: ["Inputs","Seeds","Equipment"] },
        { title: "Farmer Network", desc: "Connect with farmers in your region. Pest alerts and group purchasing.", tags: ["Alerts","Tips","Purchases"] },
        { title: "Agricultural Score", desc: "Property score for rural credit and parametric satellite insurance.", tags: ["Credit","Insurance"] },
      ],
    },
    howItWorks: {
      title: "How it works",
      h2: "From sign up to diagnosis in minutes",
      steps: [
        { icon: "📱", title: "Sign up", desc: "Free account in 2 minutes." },
        { icon: "🗺️", title: "Map your field", desc: "Draw your crop polygon on the map." },
        { icon: "🛰️", title: "Satellite analyzes", desc: "Sentinel-2 image processed automatically." },
        { icon: "📊", title: "Get your diagnosis", desc: "NDVI, VRA plan and recommended crops." },
      ],
    },
    pricing: {
      title: "Plans",
      h2: "Fair pricing for every farm size",
      plans: [
        { name: "Free", price: "US$ 0", period: "/forever", highlight: false, features: ["1 registered field","Basic NDVI diagnosis","30-day history","Marketplace (view only)"] },
        { name: "Field", price: "US$ 9.99", period: "/mo", highlight: true, features: ["Up to 5 fields","NDVI + NDRE + NDWI","VRA fertilization plan","Marketplace purchases","Automatic alerts","12-month history"] },
        { name: "Farm", price: "US$ 29.99", period: "/mo", highlight: false, features: ["Unlimited fields","Advanced AI","Agricultural score + credit","API access","PDF reports","Dedicated support"] },
      ],
      startFree: "Get started free",
      subscribe: "Subscribe",
    },
    cta: {
      h2: "Your farmland deserves\ncutting-edge technology.",
      desc: "Satellite technology accessible to farmers across Brazil and beyond.",
      startBtn: "Create free account",
      loginBtn: "I already have an account",
      footer: "💳 Credit Card · PIX · Boleto · Free plan available · Cancel anytime",
    },
    footer: { terms: "Terms of Use", privacy: "Privacy", contact: "Contact", api: "API", copy: "© 2026 SolFarm · Technology for the rural farmer" },
  },
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

export default function LandingPage() {
  const { lang, setLang } = useLang()
  const t = T[lang]

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
            <a href="#features" className="text-sm text-gray-600 hover:text-green-600 font-medium transition-colors">{t.nav.features}</a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-green-600 font-medium transition-colors">{t.nav.howItWorks}</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-green-600 font-medium transition-colors">{t.nav.pricing}</a>
          </div>
          <div className="flex items-center gap-3">
            {/* Toggle PT / EN */}
            <button
              onClick={() => setLang(lang === "pt" ? "en" : "pt")}
              className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-green-600 border border-gray-200 rounded-lg px-2.5 py-1.5 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === "pt" ? "EN" : "PT"}
            </button>
            <Link href="/login" className="text-sm font-semibold text-gray-700 hover:text-green-600 transition-colors">{t.nav.login}</Link>
            <Link href="/register">
              <Button size="sm">{t.nav.start}</Button>
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
                {t.hero.badge}
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
                {t.hero.h1a}
                <span className="text-green-600 block">{t.hero.h1b}</span>
                {t.hero.h1c}
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed mb-8 max-w-xl">{t.hero.desc}</p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    {t.hero.startBtn} <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">{t.hero.demoBtn}</Button>
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {t.hero.badges.map(b => (
                  <div key={b} className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {b}
                  </div>
                ))}
              </div>
            </div>

            {/* Card simulação */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Badge simulação */}
                <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-700">{t.hero.simLabel}</span>
                </div>
                <div className="bg-gradient-to-r from-green-700 to-green-500 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-green-200 text-sm font-medium">{t.hero.simFarm}</p>
                      <p className="text-white text-xs mt-1">{t.hero.simDesc}</p>
                    </div>
                    <div className="text-center bg-white/20 rounded-2xl px-4 py-2">
                      <p className="text-3xl font-black text-white">7.4</p>
                      <p className="text-green-200 text-xs">/10</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="text-white text-sm font-semibold">🟡 {lang === "pt" ? "Bom — Monitoramento recomendado" : "Good — Monitoring recommended"}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
                  {[["NDVI", "0.542", lang === "pt" ? "Vegetação" : "Vegetation"], ["NDRE", "0.183", lang === "pt" ? "Nitrogênio" : "Nitrogen"], ["NDWI", "-0.04", lang === "pt" ? "Umidade" : "Moisture"]].map(([l, v, d]) => (
                    <div key={l} className="p-4 text-center">
                      <p className="text-xs text-gray-400 font-semibold mb-1">{l}</p>
                      <p className="text-xl font-black text-gray-900">{v}</p>
                      <p className="text-xs text-gray-400 mt-1">{d}</p>
                    </div>
                  ))}
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{lang === "pt" ? "Mapa de calor por zona (simulado)" : "Zone heatmap (simulated)"}</p>
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
                    <p className="text-xs font-bold text-amber-800">⚠️ {lang === "pt" ? "Zona com NDVI baixo (simulação)" : "Low NDVI zone (simulation)"}</p>
                    <p className="text-xs text-amber-700 mt-1">{t.hero.simAlert}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAPACIDADES — substitui stats falsos */}
      <section className="bg-green-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {t.stats.map(([v, l]) => (
              <div key={l}>
                <p className="text-4xl font-black text-white">{v}</p>
                <p className="text-green-200 text-sm mt-2 font-medium">{l}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-green-300 text-xs mt-6">
            {lang === "pt"
              ? "Cerrado · Amazônia · Mata Atlântica · Caatinga · Pampa · Pantanal"
              : "Cerrado · Amazon · Atlantic Forest · Caatinga · Pampa · Pantanal"}
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-green-600 text-sm font-bold uppercase tracking-widest mb-3">{t.features.title}</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4 whitespace-pre-line">{t.features.h2}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.items.map(({ title, desc, tags }, idx) => {
              const icons = [Satellite, BarChart3, Map, ShoppingCart, Users, Shield]
              const Icon = icons[idx]
              return (
                <div key={title} className="group p-6 rounded-2xl border border-gray-200 hover:border-green-200 hover:shadow-lg transition-all bg-white">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-medium">{tag}</span>)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-green-600 text-sm font-bold uppercase tracking-widest mb-3">{t.howItWorks.title}</p>
            <h2 className="text-4xl font-black text-gray-900">{t.howItWorks.h2}</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {t.howItWorks.steps.map(({ icon, title, desc }, i) => (
              <div key={title} className="relative text-center">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-green-100 flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm">{icon}</div>
                {i < 3 && <div className="absolute top-6 left-[calc(50%+36px)] hidden md:block"><ChevronRight className="w-5 h-5 text-gray-300" /></div>}
                <p className="text-xs font-bold text-green-600 mb-2">{lang === "pt" ? `PASSO 0${i+1}` : `STEP 0${i+1}`}</p>
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
            <p className="text-green-600 text-sm font-bold uppercase tracking-widest mb-3">{t.pricing.title}</p>
            <h2 className="text-4xl font-black text-gray-900 mb-4">{t.pricing.h2}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {t.pricing.plans.map(({ name, price, period, highlight, features }) => (
              <div key={name} className={`rounded-3xl p-8 border-2 relative ${highlight ? "border-green-500 shadow-2xl scale-105" : "border-gray-200"}`}>
                {highlight && <div className="absolute -top-4 left-1/2 -translate-x-1/2"><span className="bg-green-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">{lang === "pt" ? "MAIS POPULAR" : "MOST POPULAR"}</span></div>}
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">{name}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-gray-900">{price}</span>
                  <span className="text-gray-400 text-sm">{period}</span>
                </div>
                <Link href={
                  (name === "Grátis" || name === "Free")
                    ? "/register"
                    : `/register?plan=${(name === "Campo" || name === "Field") ? "CAMPO" : "FAZENDA"}`
                } className="block mb-8">
                  <Button className="w-full" variant={highlight ? "default" : "outline"}>
                    {(name === "Grátis" || name === "Free") ? t.pricing.startFree : `${t.pricing.subscribe} ${name}`}
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
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 whitespace-pre-line">{t.cta.h2}</h2>
          <p className="text-xl text-green-200 mb-10 max-w-xl mx-auto">{t.cta.desc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 gap-2 font-black">
                {t.cta.startBtn} <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" className="text-white border-2 border-white/40 bg-transparent hover:bg-white/10">
                {t.cta.loginBtn}
              </Button>
            </Link>
          </div>
          <p className="text-green-300 text-sm mt-6">{t.cta.footer}</p>
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
            {[
              { label: t.footer.terms, href: "/termos" },
              { label: t.footer.privacy, href: "/privacidade" },
              { label: t.footer.contact, href: "/contato" },
              { label: t.footer.api, href: "/api-docs" },
            ].map(({ label, href }) => (
              <a key={label} href={href} className="hover:text-white transition-colors">{label}</a>
            ))}
          </div>
          <p className="text-xs text-gray-600">{t.footer.copy}</p>
        </div>
      </footer>
    </div>
  )
}
