"use client"

import { useState, useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({
  nome:     z.string().min(2, "Nome obrigatório"),
  email:    z.string().email("E-mail inválido"),
  whatsapp: z.string().min(10, "WhatsApp inválido"),
  cidade:   z.string().min(2, "Cidade obrigatória"),
})
type FormData = z.infer<typeof schema>

/* ── helpers ────────────────────────────────────────── */
const fd = { fontFamily: "var(--font-cormorant), Georgia, serif" }

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function anim(inView: boolean, delay = 0): React.CSSProperties {
  return {
    opacity:    inView ? 1 : 0,
    transform:  inView ? "translateY(0)" : "translateY(32px)",
    transition: `opacity 1s ease ${delay}ms, transform 1s ease ${delay}ms`,
  }
}

/* ── logo ───────────────────────────────────────────── */
function Logo({ size = 36, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={Math.round(size * 1.1)} viewBox="0 0 40 44" fill="none">
      <ellipse cx="20" cy="23" rx="17" ry="19" stroke={color} strokeWidth="1.1" />
      <path d="M9 31 L14 22 L18 27 L21 19 L24 23 L28 17 L33 27"
        stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

/* ── ornamento ──────────────────────────────────────── */
function Ornamento({ light = false }) {
  const c = light ? "#18150E" : "#C4944A"
  return (
    <div className="flex items-center justify-center gap-4 my-8">
      <div className="h-px w-12" style={{ background: c, opacity: 0.5 }} />
      <div className="w-1.5 h-1.5 rotate-45 shrink-0" style={{ background: c, opacity: 0.7 }} />
      <div className="h-px w-12" style={{ background: c, opacity: 0.5 }} />
    </div>
  )
}

/* ── garrafa svg ────────────────────────────────────── */
function Garrafa({ className }: { className?: string }) {
  return (
    <svg width="40" height="88" viewBox="0 0 40 88" fill="none" className={className}>
      <path d="M16 2 L16 14 C10 18, 5 26, 5 38 L5 76 C5 81 10 85 20 85 C30 85 35 81 35 76 L35 38 C35 26 30 18 24 14 L24 2 Z"
        stroke="currentColor" strokeWidth="1" fill="none" />
      <line x1="16" y1="2" x2="24" y2="2" stroke="currentColor" strokeWidth="1" />
      <line x1="5" y1="46" x2="35" y2="46" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════ */
export default function TerrabrasPage() {
  const [scrolled,   setScrolled]   = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [apiError,   setApiError]   = useState<string | null>(null)
  const [heroReady,  setHeroReady]  = useState(false)

  useEffect(() => {
    setHeroReady(true)
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setApiError(null)
    const res = await fetch("/api/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.status === 409) { setApiError("Este e-mail já está na nossa lista."); return }
    if (!res.ok)            { setApiError("Erro ao salvar. Tente novamente."); return }
    setSubmitted(true)
  }

  const navLinks = [
    ["#historia", "História"],
    ["#terroir",  "Terroir"],
    ["#vinhos",   "Vinhos"],
    ["#cadastro", "Contato"],
  ]

  /* section refs */
  const s1 = useInView(); const s2 = useInView(); const s3 = useInView()
  const s4 = useInView(); const s5 = useInView(); const s6 = useInView()
  const s7 = useInView(); const s8 = useInView(); const s9 = useInView()

  return (
    <div className="min-h-screen" style={{ background: "#18150E", color: "#F2EDE4" }}>

      {/* ══ MENU MOBILE OVERLAY ════════════════════════════ */}
      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-500"
        style={{
          background: "#0E0B06",
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-6 right-6 text-[#F2EDE4]/50 hover:text-[#C4944A] transition-colors p-2"
          aria-label="Fechar menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 6 L18 18 M18 6 L6 18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
        <nav className="flex flex-col items-center gap-10">
          {navLinks.map(([href, label], i) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="transition-all duration-300"
              style={{
                fontFamily: fd.fontFamily,
                fontSize: "2.8rem",
                fontWeight: 300,
                color: menuOpen ? "#F2EDE4" : "transparent",
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              {label}
            </a>
          ))}
          <a
            href="#cadastro"
            onClick={() => setMenuOpen(false)}
            className="mt-4 px-8 py-3 border text-[10px] tracking-[0.3em] uppercase font-light transition-colors"
            style={{ borderColor: "#C4944A50", color: "#C4944A" }}
          >
            Cadastre-se
          </a>
        </nav>
      </div>

      {/* ══ NAVBAR ═════════════════════════════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? "rgba(24,21,14,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(196,148,74,0.08)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-16 h-[72px] flex items-center justify-between">
          <a href="#inicio" className="flex items-center gap-3">
            <Logo size={30} color="#C4944A" />
            <span className="text-base tracking-[0.3em] uppercase font-light" style={fd}>
              Terrabras
            </span>
          </a>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href}
                className="text-[9px] tracking-[0.25em] uppercase font-light transition-colors"
                style={{ color: "rgba(242,237,228,0.55)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#C4944A")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(242,237,228,0.55)")}
              >
                {label}
              </a>
            ))}
            <a href="#cadastro"
              className="ml-2 px-5 py-2 text-[9px] tracking-[0.25em] uppercase font-light transition-colors"
              style={{ border: "1px solid rgba(196,148,74,0.45)", color: "#C4944A" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(196,148,74,0.08)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              Cadastre-se
            </a>
          </div>

          {/* Hamburger mobile */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
          >
            {[0,1,2].map(i => (
              <span key={i} className="block h-px w-6" style={{ background: "#F2EDE4", opacity: 0.7 }} />
            ))}
          </button>
        </div>
      </nav>

      {/* ══ HERO ═══════════════════════════════════════════ */}
      <section
        id="inicio"
        className="grain relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 20% 65%, rgba(120,68,16,0.14) 0%, transparent 55%)," +
            "radial-gradient(ellipse at 80% 20%, rgba(90,48,10,0.10) 0%, transparent 50%)," +
            "linear-gradient(180deg, #18150E 0%, #1D1910 50%, #18150E 100%)",
        }}
      >
        {/* Foto hero — substitua pelo src da foto real */}
        {/* <Image src="/fotos/hero.jpg" alt="Vinhedo Terrabras" fill className="object-cover opacity-30" /> */}

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(196,148,74,0.2))" }} />

        <div className="max-w-4xl mx-auto">
          <p style={{ ...anim(heroReady, 0), fontSize: "0.6rem", letterSpacing: "0.5em", color: "rgba(196,148,74,0.7)", textTransform: "uppercase", fontWeight: 300, marginBottom: "2.5rem" }}>
            Serra da Canastra &nbsp;·&nbsp; 1.350 m &nbsp;·&nbsp; Minas Gerais
          </p>

          <h1 style={{ ...fd, ...anim(heroReady, 150), fontSize: "clamp(3rem, 8vw, 6.5rem)", fontWeight: 300, lineHeight: 1.08, letterSpacing: "-0.01em", marginBottom: "2rem" }}>
            Uma terra que já<br />
            <em style={{ fontStyle: "italic", color: "#C4944A" }}>nasceu com história.</em>
          </h1>

          <div style={anim(heroReady, 300)}>
            <Ornamento />
          </div>

          <p style={{ ...anim(heroReady, 450), fontSize: "0.95rem", lineHeight: 1.9, color: "rgba(242,237,228,0.5)", maxWidth: "520px", margin: "0 auto 4rem", fontWeight: 300 }}>
            Ao pé da Serra da Canastra, em solo com milhões de anos, onde a família
            já colhia os melhores cafés do Brasil — agora também nasce o vinho.
          </p>

          <div style={anim(heroReady, 600)}>
            <a href="#historia" className="inline-flex flex-col items-center gap-3 transition-colors"
              style={{ fontSize: "0.55rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(242,237,228,0.3)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(196,148,74,0.7)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(242,237,228,0.3)")}
            >
              Conheça a história
              <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
                <path d="M6 1 L6 18 M1 13 L6 18 L11 13" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
              </svg>
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24"
          style={{ background: "linear-gradient(to bottom, rgba(196,148,74,0.15), transparent)" }} />
      </section>

      {/* ══ NÚMEROS ════════════════════════════════════════ */}
      <section style={{ background: "#0E0B06", borderTop: "1px solid rgba(196,148,74,0.08)", borderBottom: "1px solid rgba(196,148,74,0.08)" }}>
        <div ref={s1.ref} className="max-w-5xl mx-auto px-6 lg:px-16 py-16 grid grid-cols-3 gap-px" style={{ background: "rgba(196,148,74,0.06)" }}>
          {[
            { n: "70+",     l: "Anos de família\nna mesma terra" },
            { n: "1.350 m", l: "Altitude\nSerra da Canastra" },
            { n: "2024",    l: "Primeira safra\nSyrah & Cab. Franc" },
          ].map(({ n, l }, i) => (
            <div key={n} className="text-center py-10 px-6" style={{ background: "#0E0B06", ...anim(s1.inView, i * 120) }}>
              <p style={{ ...fd, fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 300, color: "#C4944A", lineHeight: 1 }}>{n}</p>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(242,237,228,0.35)", marginTop: "0.75rem", lineHeight: 1.7, fontWeight: 300 }}>
                {l.split("\n").map((t, j) => <span key={j}>{t}{j === 0 && <br />}</span>)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ MANIFESTO ══════════════════════════════════════ */}
      <section className="grain py-36 px-6 text-center" style={{ background: "#18150E" }}>
        <div ref={s2.ref} className="max-w-4xl mx-auto">
          <p style={{ ...anim(s2.inView, 0), fontSize: "0.6rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(196,148,74,0.5)", marginBottom: "3rem", fontWeight: 300 }}>
            — manifesto —
          </p>
          <blockquote style={{ ...fd, ...anim(s2.inView, 150), fontSize: "clamp(1.5rem, 3.5vw, 2.6rem)", fontWeight: 300, lineHeight: 1.55, color: "rgba(242,237,228,0.82)", fontStyle: "italic" }}>
            "Sete décadas de raízes num solo que leva milhões de anos a
            formar. Quando a terra já tem tanto a dizer, o vinho é apenas
            mais uma das suas línguas."
          </blockquote>
          <p style={{ ...anim(s2.inView, 300), fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(196,148,74,0.45)", marginTop: "2.5rem", fontWeight: 300 }}>
            Pedro Bras, fundador
          </p>
        </div>
      </section>

      {/* ══ HISTÓRIA ═══════════════════════════════════════ */}
      <section id="historia" style={{ background: "#F2EDE4", color: "#18150E" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-16 py-28 lg:py-36">

          <div ref={s3.ref} className="mb-20">
            <p style={{ ...anim(s3.inView, 0), fontSize: "0.6rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "#C4944A", marginBottom: "1.2rem", fontWeight: 300 }}>
              A Origem
            </p>
            <h2 style={{ ...fd, ...anim(s3.inView, 100), fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 300, lineHeight: 1.05 }}>
              Pedro Bras<br />
              <span style={{ color: "#C4944A" }}>&amp;</span> Antonio Terra
            </h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
            <div ref={s4.ref} className="lg:col-span-7 space-y-7" style={{ fontSize: "0.95rem", lineHeight: 1.95, color: "rgba(24,21,14,0.62)", fontWeight: 300 }}>
              <p style={anim(s4.inView, 0)}>
                Pedro Bras cresceu entre cafezais em Piumhi. Por mais de setenta anos,
                a família plantou, colheu e aprendeu a ler a terra — a mesma terra que
                hoje produz os vinhos da Terrabras. Cafés premiados como os melhores
                do Brasil, cultivados nesse solo antigo, de camadas argilosas formadas
                por milhões de anos de história geológica.
              </p>
              <p style={anim(s4.inView, 100)}>
                Ao pé da Serra da Canastra, onde o cerrado encontra o clima de altitude,
                Pedro percebeu que aquela terra tinha mais a oferecer. O mesmo solo que
                guardava a essência do café poderia guardar algo mais. E foi assim que
                plantou as primeiras mudas de Syrah — na encosta onde os avós já pisavam.
              </p>
              <p style={anim(s4.inView, 200)}>
                Antonio Terra é amigo de Pedro há mais tempo do que qualquer um se lembra.
                A amizade entre as famílias precedia a deles — os pais já se conheciam,
                os avós também. Quando Pedro decidiu que aquela encosta merecia um vinho,
                Antonio estava ao lado. O sobrenome de um, a história de vida do outro:
                juntos formaram a Terrabras.
              </p>
            </div>

            <div ref={s5.ref} className="lg:col-span-5 flex flex-col justify-center gap-10">
              {[
                { v: "70+",    d: "Anos de história familiar cultivando a mesma terra" },
                { v: "1.350",  d: "Metros — onde o café premiado e o vinho dividem o solo" },
                { v: "2024",   d: "Primeira safra — edição limitada e numerada" },
              ].map(({ v, d }, i) => (
                <div key={v} style={{ ...anim(s5.inView, i * 120), borderLeft: "1px solid rgba(24,21,14,0.12)", paddingLeft: "1.5rem", paddingBottom: "2.5rem", borderBottom: i < 2 ? "1px solid rgba(24,21,14,0.07)" : "none" }}>
                  <span style={{ ...fd, fontSize: "2.4rem", fontWeight: 300, color: "#C4944A", display: "block", lineHeight: 1 }}>{v}</span>
                  <p style={{ fontSize: "0.8rem", color: "rgba(24,21,14,0.5)", lineHeight: 1.7, marginTop: "0.5rem", fontWeight: 300 }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ TERROIR ════════════════════════════════════════ */}
      <section id="terroir" className="grain" style={{ background: "#161210" }}>
        {/* Foto terroir — descomente quando tiver a foto
        <div className="relative h-64 lg:h-80 overflow-hidden">
          <Image src="/fotos/vinhedo.jpg" alt="Vinhedo" fill className="object-cover opacity-40" />
        </div> */}
        <div className="max-w-6xl mx-auto px-6 lg:px-16 py-28 lg:py-36">
          <div ref={s6.ref} className="mb-20">
            <p style={{ ...anim(s6.inView, 0), fontSize: "0.6rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(196,148,74,0.7)", marginBottom: "1.2rem", fontWeight: 300 }}>
              O Terroir
            </p>
            <h2 style={{ ...fd, ...anim(s6.inView, 100), fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 300, lineHeight: 1.05 }}>
              Solo. Altitude.<br />
              <span style={{ color: "rgba(242,237,228,0.3)" }}>Tempo.</span>
            </h2>
          </div>

          {/* Stats grid */}
          <div ref={s7.ref} className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-20" style={{ background: "rgba(196,148,74,0.08)" }}>
            {[
              { v: "1.350 m",       l: "Altitude" },
              { v: "Dupla Poda",    l: "Técnica de Cultivo" },
              { v: "Argiloso",      l: "Tipo de Solo" },
              { v: "Serra\nCanastra", l: "Localização · MG" },
            ].map(({ v, l }, i) => (
              <div key={l} className="py-10 px-7" style={{ background: "#161210", ...anim(s7.inView, i * 90) }}>
                <p style={{ ...fd, fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)", fontWeight: 300, color: "#F2EDE4", lineHeight: 1.2 }}>
                  {v.split("\n").map((t, j) => <span key={j}>{t}{j === 0 && v.includes("\n") && <br />}</span>)}
                </p>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(242,237,228,0.3)", marginTop: "0.6rem", fontWeight: 300 }}>{l}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            <div ref={s8.ref} style={{ fontSize: "0.95rem", lineHeight: 1.95, color: "rgba(242,237,228,0.52)", fontWeight: 300 }}>
              <p style={anim(s8.inView, 0)}>
                Ao pé da Serra da Canastra, o vinhedo da Terrabras ocupa uma encosta
                a 1.350 metros de altitude. O solo carrega camadas argilosas formadas
                por milhões de anos de sedimentos — uma terra densa, rica, que guarda
                umidade e minerais como poucos solos no Brasil.
              </p>
              <p style={{ ...anim(s8.inView, 120), marginTop: "1.5rem" }}>
                As noites frescas da serra preservam a acidez natural da uva e constroem
                aromas mais complexos. O dia quente amadurece os taninos; a noite fria os
                refina. A técnica da <em>dupla poda</em> ajusta o ciclo da videira ao
                clima tropical, extraindo o melhor do terroir em cada safra.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <p style={{ ...fd, ...anim(s8.inView, 200), fontSize: "1.25rem", fontStyle: "italic", color: "rgba(242,237,228,0.28)", lineHeight: 1.6 }}>
                "O mesmo solo que produziu cafés premiados como os melhores
                do Brasil — agora também expressa vinho."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ VINHOS ═════════════════════════════════════════ */}
      <section id="vinhos" style={{ background: "#F2EDE4", color: "#18150E" }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-16 py-28 lg:py-36">
          <div className="text-center mb-20">
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "#C4944A", marginBottom: "1.2rem", fontWeight: 300 }}>
              Os Vinhos
            </p>
            <h2 style={{ ...fd, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 300 }}>
              Safra 2024
            </h2>
            <Ornamento light />
            <p style={{ fontSize: "0.8rem", color: "rgba(24,21,14,0.45)", maxWidth: "340px", margin: "0 auto", lineHeight: 1.8, fontWeight: 300 }}>
              Produção artesanal e extremamente limitada.<br />Cada garrafa numerada.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { nome: "Syrah",          nota: "Tinto encorpado. Ameixa escura, especiarias e toque mineral. Taninos elegantes, final longo." },
              { nome: "Cabernet Franc", nota: "Tinto elegante. Frutas vermelhas, pimentão maduro e ervas da Serra. Estrutura refinada, acidez viva." },
            ].map(({ nome, nota }, i) => (
              <div
                key={nome}
                className="group text-center py-14 px-10 transition-all duration-500"
                style={{
                  border: "1px solid rgba(24,21,14,0.1)",
                  ...anim(s8.inView, i * 150),
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(196,148,74,0.45)"; (e.currentTarget as HTMLDivElement).style.background = "rgba(196,148,74,0.03)" }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(24,21,14,0.1)"; (e.currentTarget as HTMLDivElement).style.background = "transparent" }}
              >
                {/* Foto vinho — descomente quando tiver
                <div className="relative h-48 mb-8 overflow-hidden">
                  <Image src={`/fotos/${nome.toLowerCase().replace(" ","_")}.jpg`} alt={nome} fill className="object-contain" />
                </div> */}
                <div className="flex justify-center mb-8">
                  <Garrafa className="text-[rgba(24,21,14,0.2)] group-hover:text-[rgba(196,148,74,0.45)] transition-colors duration-500" />
                </div>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#C4944A", marginBottom: "0.5rem", fontWeight: 300 }}>
                  Terrabras
                </p>
                <h3 style={{ ...fd, fontSize: "2rem", fontWeight: 300, marginBottom: "0.3rem" }}>{nome}</h3>
                <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(24,21,14,0.3)", marginBottom: "1.5rem", fontWeight: 300 }}>
                  Safra 2024
                </p>
                <div style={{ height: "1px", background: "rgba(24,21,14,0.08)", margin: "0 0 1.5rem" }} />
                <p style={{ fontSize: "0.82rem", color: "rgba(24,21,14,0.55)", lineHeight: 1.85, marginBottom: "2rem", fontWeight: 300 }}>{nota}</p>
                <div style={{ fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(24,21,14,0.3)", lineHeight: 2, fontWeight: 300 }}>
                  <p>Serra da Canastra · MG</p>
                  <p>1.350 m · Dupla Poda</p>
                  <p>Edição limitada · a partir de R$ 350</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CADASTRO ═══════════════════════════════════════ */}
      <section id="cadastro" className="grain" style={{ background: "#0E0B06" }}>
        <div ref={s9.ref} className="max-w-lg mx-auto px-6 py-28 lg:py-36 text-center">
          <p style={{ ...anim(s9.inView, 0), fontSize: "0.6rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(196,148,74,0.7)", marginBottom: "1.2rem", fontWeight: 300 }}>
            Lista Exclusiva
          </p>
          <h2 style={{ ...fd, ...anim(s9.inView, 100), fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 300, marginBottom: "0.5rem" }}>
            Cada safra é limitada.
          </h2>
          <div style={anim(s9.inView, 200)}><Ornamento /></div>
          <p style={{ ...anim(s9.inView, 250), fontSize: "0.85rem", color: "rgba(242,237,228,0.4)", lineHeight: 1.9, marginBottom: "3rem", fontWeight: 300 }}>
            Inscreva-se para ser o primeiro a saber quando os vinhos
            estiverem disponíveis. Produção artesanal — sem segunda chance
            na prateleira.
          </p>

          {submitted ? (
            <div style={anim(true, 0)}>
              <div style={{ width: "52px", height: "52px", borderRadius: "50%", border: "1px solid rgba(196,148,74,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <path d="M3 11 L8 16 L19 6" stroke="#C4944A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 style={{ ...fd, fontSize: "2.2rem", fontWeight: 300, color: "#C4944A", marginBottom: "0.5rem" }}>Perfeito.</h3>
              <p style={{ fontSize: "0.82rem", color: "rgba(242,237,228,0.35)", fontWeight: 300 }}>
                Você está na lista. Entraremos em contato na próxima safra.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
              <div className="grid sm:grid-cols-2 gap-4">
                {([
                  { f: "nome",     l: "Nome completo",    p: "Seu nome",          t: "text"  },
                  { f: "email",    l: "E-mail",           p: "seu@email.com",     t: "email" },
                  { f: "whatsapp", l: "WhatsApp",         p: "(11) 99999-9999",   t: "tel"   },
                  { f: "cidade",   l: "Cidade",           p: "São Paulo",         t: "text"  },
                ] as const).map(({ f, l, p, t }) => (
                  <div key={f}>
                    <label style={{ display: "block", fontSize: "0.55rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(242,237,228,0.3)", marginBottom: "0.5rem", fontWeight: 300 }}>
                      {l}
                    </label>
                    <input
                      {...register(f)}
                      type={t}
                      placeholder={p}
                      style={{ width: "100%", background: "transparent", border: "1px solid rgba(242,237,228,0.1)", outline: "none", padding: "0.875rem 1rem", fontSize: "0.85rem", color: "#F2EDE4", fontWeight: 300 }}
                      onFocus={e  => (e.target.style.borderColor = "rgba(196,148,74,0.5)")}
                      onBlur={e   => (e.target.style.borderColor = "rgba(242,237,228,0.1)")}
                    />
                    {errors[f] && <p style={{ fontSize: "0.65rem", color: "rgba(248,113,113,0.7)", marginTop: "0.3rem" }}>{errors[f]?.message}</p>}
                  </div>
                ))}
              </div>

              {apiError && <p style={{ textAlign: "center", fontSize: "0.7rem", color: "rgba(248,113,113,0.7)" }}>{apiError}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                style={{ width: "100%", padding: "1rem", background: "#C4944A", color: "#18150E", fontSize: "0.65rem", letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 500, marginTop: "0.5rem", cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.6 : 1, transition: "background 0.3s" }}
                onMouseEnter={e => !isSubmitting && ((e.target as HTMLButtonElement).style.background = "#D4A45A")}
                onMouseLeave={e => ((e.target as HTMLButtonElement).style.background = "#C4944A")}
              >
                {isSubmitting ? "Enviando..." : "Garantir minha vaga na lista"}
              </button>

              <p style={{ textAlign: "center", fontSize: "0.6rem", color: "rgba(242,237,228,0.15)", fontWeight: 300 }}>
                Nenhum spam. Apenas quando os vinhos estiverem disponíveis.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ══ FOOTER ═════════════════════════════════════════ */}
      <footer style={{ background: "#0A0806", borderTop: "1px solid rgba(242,237,228,0.05)", padding: "4rem 1.5rem" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <Logo size={24} color="#C4944A" />
              <div>
                <p style={{ ...fd, fontSize: "0.95rem", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 300, color: "rgba(242,237,228,0.7)" }}>
                  Terrabras
                </p>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(242,237,228,0.22)", fontWeight: 300 }}>
                  Serra da Canastra · Minas Gerais
                </p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              {navLinks.map(([href, label]) => (
                <a key={href} href={href}
                  style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(242,237,228,0.25)", fontWeight: 300, transition: "color 0.3s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(196,148,74,0.6)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(242,237,228,0.25)")}
                >
                  {label}
                </a>
              ))}
            </div>

            <p style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: "rgba(242,237,228,0.15)", fontWeight: 300 }}>
              © 2026 Terrabras
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
