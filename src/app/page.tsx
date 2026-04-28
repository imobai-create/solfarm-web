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
    <div className="min-h-screen bg-background text-foreground">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm shadow-primary/30">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-foreground">Sol</span>
              <span className="text-primary">Farm</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-foreground/70 hover:text-primary font-medium transition-colors">{t.nav.features}</a>
            <a href="#how-it-works" className="text-sm text-foreground/70 hover:text-primary font-medium transition-colors">{t.nav.howItWorks}</a>
            <a href="#pricing" className="text-sm text-foreground/70 hover:text-primary font-medium transition-colors">{t.nav.pricing}</a>
          </div>
          <div className="flex items-center gap-3">
            {/* Toggle PT / EN */}
            <button
              onClick={() => setLang(lang === "pt" ? "en" : "pt")}
              className="flex items-center gap-1.5 text-xs font-semibold text-foreground/60 hover:text-primary border border-border rounded-lg px-2.5 py-1.5 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === "pt" ? "EN" : "PT"}
            </button>
            <Link href="/login" className="text-sm font-semibold text-foreground/80 hover:text-primary transition-colors">{t.nav.login}</Link>
            <Link href="/register">
              <Button size="sm" className="bg-primary hover:bg-primary-dark text-white shadow-sm shadow-primary/30">{t.nav.start}</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 hero-aurora -z-20" />
        <div className="absolute inset-0 grid-bg -z-10 opacity-60" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary-bg text-primary-dark text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 border border-primary/15">
                <Zap className="w-3 h-3" />
                {t.hero.badge}
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-[1.05] mb-6 tracking-tight">
                {t.hero.h1a}
                <span className="text-primary block">{t.hero.h1b}</span>
                <span className="text-foreground/80">{t.hero.h1c}</span>
              </h1>
              <p className="text-lg text-foreground/60 leading-relaxed mb-8 max-w-xl">{t.hero.desc}</p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary-dark text-white shadow-lg shadow-primary/25">
                    {t.hero.startBtn} <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-border hover:border-primary/40 hover:bg-primary-bg">{t.hero.demoBtn}</Button>
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60">
                {t.hero.badges.map(b => (
                  <div key={b} className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" /> {b}
                  </div>
                ))}
              </div>
            </div>

            {/* Card simulação */}
            <div className="hidden lg:block">
              <div className="bg-card rounded-3xl shadow-xl shadow-primary/5 border border-border overflow-hidden">
                {/* Badge simulação */}
                <div className="bg-gold-bg border-b border-gold/20 px-4 py-2 flex items-center gap-2">
                  <span className="text-xs font-semibold text-gold">{t.hero.simLabel}</span>
                </div>
                <div className="relative bg-gradient-to-br from-primary-dark via-primary to-primary-light p-6 overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/20 blur-2xl" />
                  <div className="relative flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white/80 text-sm font-medium">{t.hero.simFarm}</p>
                      <p className="text-white/60 text-xs mt-1">{t.hero.simDesc}</p>
                    </div>
                    <div className="text-center bg-white/15 backdrop-blur rounded-2xl px-4 py-2 border border-white/20">
                      <p className="text-3xl font-bold text-white">7.4</p>
                      <p className="text-white/70 text-xs">/10</p>
                    </div>
                  </div>
                  <div className="relative flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                    <span className="text-white text-sm font-semibold">🟡 {lang === "pt" ? "Bom — Monitoramento recomendado" : "Good — Monitoring recommended"}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
                  {[["NDVI", "0.542", lang === "pt" ? "Vegetação" : "Vegetation"], ["NDRE", "0.183", lang === "pt" ? "Nitrogênio" : "Nitrogen"], ["NDWI", "-0.04", lang === "pt" ? "Umidade" : "Moisture"]].map(([l, v, d]) => (
                    <div key={l} className="p-4 text-center">
                      <p className="text-xs text-muted font-semibold mb-1">{l}</p>
                      <p className="text-xl font-bold text-foreground">{v}</p>
                      <p className="text-xs text-muted mt-1">{d}</p>
                    </div>
                  ))}
                </div>
                <div className="p-5">
                  <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3">{lang === "pt" ? "Mapa de calor por zona (simulado)" : "Zone heatmap (simulated)"}</p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      [0.72,"EXCELENTE"],[0.54,"BOM"],[0.41,"REGULAR"],
                      [0.61,"BOM"],[0.38,"REGULAR"],[0.71,"EXCELENTE"],
                      [0.18,"CRÍTICO"],[0.59,"BOM"],[0.67,"BOM"],
                    ].map(([v, s], i) => (
                      <div key={i} className="rounded-xl p-2 text-center" style={{ backgroundColor: ndviBg(v as number) }}>
                        <p className="text-xs font-bold" style={{ color: ndviColorStr(v as number) }}>{(v as number).toFixed(2)}</p>
                        <p className="text-[9px] text-foreground/50 mt-0.5">{s}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-gold-bg rounded-xl border border-gold/20">
                    <p className="text-xs font-semibold text-gold">⚠️ {lang === "pt" ? "Zona com NDVI baixo (simulação)" : "Low NDVI zone (simulation)"}</p>
                    <p className="text-xs text-gold/80 mt-1">{t.hero.simAlert}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAPACIDADES — substitui stats falsos */}
      <section className="relative bg-primary-dark py-14 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "radial-gradient(50% 50% at 20% 30%, rgba(34,211,238,0.6) 0%, rgba(34,211,238,0) 60%), radial-gradient(40% 40% at 80% 70%, rgba(245,158,11,0.3) 0%, rgba(245,158,11,0) 60%)"
          }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {t.stats.map(([v, l]) => (
              <div key={l}>
                <p className="text-4xl font-bold text-white tracking-tight">{v}</p>
                <p className="text-white/70 text-sm mt-2 font-medium">{l}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-white/50 text-xs mt-6">
            {lang === "pt"
              ? "Cerrado · Amazônia · Mata Atlântica · Caatinga · Pampa · Pantanal"
              : "Cerrado · Amazon · Atlantic Forest · Caatinga · Pampa · Pantanal"}
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-3">{t.features.title}</p>
            <h2 className="text-4xl font-bold text-foreground mb-4 whitespace-pre-line tracking-tight">{t.features.h2}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.features.items.map(({ title, desc, tags }, idx) => {
              const icons = [Satellite, BarChart3, Map, ShoppingCart, Users, Shield]
              const Icon = icons[idx]
              return (
                <div key={title} className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-primary-bg flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed mb-4">{desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => <span key={tag} className="text-xs bg-accent-bg text-foreground/70 px-2 py-1 rounded-lg font-medium border border-accent/10">{tag}</span>)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 bg-card-subtle relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50 -z-0" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-3">{t.howItWorks.title}</p>
            <h2 className="text-4xl font-bold text-foreground tracking-tight">{t.howItWorks.h2}</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {t.howItWorks.steps.map(({ icon, title, desc }, i) => (
              <div key={title} className="relative text-center">
                <div className="w-16 h-16 rounded-2xl bg-card border border-primary/15 flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm shadow-primary/5">{icon}</div>
                {i < 3 && <div className="absolute top-6 left-[calc(50%+36px)] hidden md:block"><ChevronRight className="w-5 h-5 text-border" /></div>}
                <p className="text-xs font-semibold text-primary mb-2 tracking-wider">{lang === "pt" ? `PASSO 0${i+1}` : `STEP 0${i+1}`}</p>
                <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-foreground/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-3">{t.pricing.title}</p>
            <h2 className="text-4xl font-bold text-foreground mb-4 tracking-tight">{t.pricing.h2}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {t.pricing.plans.map(({ name, price, period, highlight, features }) => (
              <div key={name} className={`rounded-3xl p-8 relative bg-card ${highlight ? "border-2 border-primary shadow-2xl shadow-primary/15 scale-[1.03]" : "border border-border"}`}>
                {highlight && <div className="absolute -top-4 left-1/2 -translate-x-1/2"><span className="bg-primary text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-md shadow-primary/30">{lang === "pt" ? "MAIS POPULAR" : "MOST POPULAR"}</span></div>}
                <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">{name}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-foreground tracking-tight">{price}</span>
                  <span className="text-foreground/40 text-sm">{period}</span>
                </div>
                <Link href={
                  (name === "Grátis" || name === "Free")
                    ? "/register"
                    : `/register?plan=${(name === "Campo" || name === "Field") ? "CAMPO" : "FAZENDA"}`
                } className="block mb-8">
                  <Button className={`w-full ${highlight ? "bg-primary hover:bg-primary-dark text-white shadow-sm shadow-primary/30" : ""}`} variant={highlight ? "default" : "outline"}>
                    {(name === "Grátis" || name === "Free") ? t.pricing.startFree : `${t.pricing.subscribe} ${name}`}
                  </Button>
                </Link>
                <ul className="space-y-3">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/70">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-dark">
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: "radial-gradient(50% 60% at 20% 30%, rgba(34,211,238,0.5) 0%, rgba(34,211,238,0) 55%), radial-gradient(40% 50% at 80% 70%, rgba(245,158,11,0.3) 0%, rgba(245,158,11,0) 55%)"
          }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 whitespace-pre-line tracking-tight leading-tight">{t.cta.h2}</h2>
          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">{t.cta.desc}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-primary-dark hover:bg-white/90 gap-2 font-semibold shadow-xl">
                {t.cta.startBtn} <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" className="text-white border border-white/30 bg-white/5 hover:bg-white/10 backdrop-blur">
                {t.cta.loginBtn}
              </Button>
            </Link>
          </div>
          <p className="text-white/60 text-sm mt-6">{t.cta.footer}</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-foreground text-background/60 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Sol<span className="text-primary-light">Farm</span></span>
            <span className="text-white/30 ml-3 text-sm">solfarm.com.br</span>
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
          <p className="text-xs text-white/30">{t.footer.copy}</p>
        </div>
      </footer>
    </div>
  )
}
