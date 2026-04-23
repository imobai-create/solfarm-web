"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("E-mail inválido"),
  whatsapp: z.string().min(10, "WhatsApp inválido"),
  cidade: z.string().min(2, "Cidade obrigatória"),
})

type FormData = z.infer<typeof schema>

function TerrabrasLogo({ size = 40, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={Math.round(size * 1.1)} viewBox="0 0 40 44" fill="none">
      <ellipse cx="20" cy="23" rx="17" ry="19" stroke={color} strokeWidth="1.2" />
      <path
        d="M9 31 L14 22 L18 27 L21 19 L24 23 L28 17 L33 27"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

function Ornamento() {
  return (
    <div className="flex items-center justify-center gap-3 my-8">
      <div className="h-px w-10 bg-[#C4944A]" />
      <div className="w-1.5 h-1.5 bg-[#C4944A] rotate-45 shrink-0" />
      <div className="h-px w-10 bg-[#C4944A]" />
    </div>
  )
}

function GarrafaSVG({ className }: { className?: string }) {
  return (
    <svg width="44" height="96" viewBox="0 0 44 96" fill="none" className={className}>
      <path
        d="M18 2 L18 16 C12 20, 6 29, 6 43 L6 84 C6 89, 12 93, 22 93 C32 93, 38 89, 38 84 L38 43 C38 29, 32 20, 26 16 L26 2 Z"
        stroke="currentColor"
        strokeWidth="1.1"
        fill="none"
      />
      <line x1="18" y1="2" x2="26" y2="2" stroke="currentColor" strokeWidth="1.1" />
      <line x1="6" y1="52" x2="38" y2="52" stroke="currentColor" strokeWidth="0.6" opacity="0.4" />
    </svg>
  )
}

export default function TerrabrasPage() {
  const [scrolled, setScrolled] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const [apiError, setApiError] = useState<string | null>(null)

  const onSubmit = async (data: FormData) => {
    setApiError(null)
    const res = await fetch("/api/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (res.status === 409) {
      setApiError("Este e-mail já está na nossa lista.")
      return
    }
    if (!res.ok) {
      setApiError("Erro ao salvar. Tente novamente.")
      return
    }
    setSubmitted(true)
  }

  const fontDisplay = { fontFamily: "var(--font-cormorant), Georgia, serif" }

  return (
    <div className="min-h-screen bg-[#18150E] text-[#F2EDE4]">

      {/* ─── NAVBAR ─────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#18150E]/96 backdrop-blur-md border-b border-[#C4944A]/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <a href="#inicio" className="flex items-center gap-3">
            <TerrabrasLogo size={32} color="#C4944A" />
            <span
              className="text-lg tracking-[0.28em] uppercase font-light text-[#F2EDE4]"
              style={fontDisplay}
            >
              Terrabras
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {[
              ["#historia", "História"],
              ["#terroir", "Terroir"],
              ["#vinhos", "Vinhos"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="text-[10px] tracking-[0.22em] uppercase font-light text-[#F2EDE4]/60 hover:text-[#C4944A] transition-colors"
              >
                {label}
              </a>
            ))}
            <a
              href="#cadastro"
              className="ml-2 px-5 py-2 border border-[#C4944A]/50 text-[#C4944A] text-[10px] tracking-[0.22em] uppercase font-light hover:bg-[#C4944A]/10 transition-colors"
            >
              Cadastre-se
            </a>
          </div>

          {/* Mobile CTA */}
          <a
            href="#cadastro"
            className="md:hidden text-[10px] tracking-[0.2em] uppercase text-[#C4944A] font-light border border-[#C4944A]/40 px-4 py-2"
          >
            Lista
          </a>
        </div>
      </nav>

      {/* ─── HERO ───────────────────────────────────────── */}
      <section
        id="inicio"
        className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at 25% 60%, rgba(110,60,15,0.13) 0%, transparent 60%)," +
            "radial-gradient(ellipse at 78% 25%, rgba(80,42,10,0.09) 0%, transparent 55%)," +
            "linear-gradient(180deg, #18150E 0%, #1E1A10 45%, #18150E 100%)",
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-28 bg-gradient-to-b from-transparent to-[#C4944A]/25" />

        <div className="max-w-3xl mx-auto">
          <p className="text-[9px] tracking-[0.45em] uppercase text-[#C4944A]/75 mb-10 font-light">
            Serra da Canastra &nbsp;·&nbsp; 1.350 m &nbsp;·&nbsp; Minas Gerais
          </p>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light leading-[1.1] mb-8"
            style={fontDisplay}
          >
            Uma terra que já
            <br />
            <em className="not-italic text-[#C4944A]">nasceu com história.</em>
          </h1>

          <Ornamento />

          <p className="text-sm sm:text-base font-light text-[#F2EDE4]/55 leading-[1.9] max-w-xl mx-auto mb-14">
            Ao pé da Serra da Canastra, em solo com milhões de anos, onde a família
            já colhia os melhores cafés do Brasil — agora também nasce o vinho.
          </p>

          <a
            href="#historia"
            className="inline-flex flex-col items-center gap-2 text-[9px] tracking-[0.3em] uppercase text-[#F2EDE4]/35 hover:text-[#C4944A]/70 transition-colors duration-300"
          >
            Conheça a história
            <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
              <path d="M7 2 L7 19 M2 14 L7 19 L12 14" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
            </svg>
          </a>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-[#C4944A]/20 to-transparent" />
      </section>

      {/* ─── MANIFESTO ──────────────────────────────────── */}
      <section className="py-28 px-6 text-center" style={{ background: "#0E0B06" }}>
        <div className="max-w-3xl mx-auto">
          <blockquote
            className="text-2xl sm:text-3xl lg:text-[2.1rem] font-light leading-relaxed text-[#F2EDE4]/80 italic"
            style={fontDisplay}
          >
            "Sete décadas de raízes num solo que leva milhões de anos a formar.
            Quando a terra já tem tanto a dizer, o vinho é apenas mais uma das suas línguas."
          </blockquote>
          <p className="mt-8 text-[9px] tracking-[0.35em] uppercase text-[#C4944A]/55 font-light">
            Pedro Bras, fundador
          </p>
        </div>
      </section>

      {/* ─── HISTÓRIA ───────────────────────────────────── */}
      <section id="historia" className="py-28 px-6" style={{ background: "#F2EDE4", color: "#18150E" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-[9px] tracking-[0.42em] uppercase text-[#C4944A] font-light mb-3">
              A Origem
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light" style={fontDisplay}>
              Pedro Bras
              <br />
              <span className="text-[#C4944A]">&amp;</span> Antonio Terra
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            <div className="space-y-7 text-[#18150E]/65 text-[0.95rem] leading-[1.95] font-light">
              <p>
                Pedro Bras cresceu entre cafezais em Piumhi. Por mais de setenta anos, a família plantou,
                colheu e aprendeu a ler a terra — a mesma terra que hoje produz os vinhos da Terrabras.
                Cafés premiados como os melhores do Brasil, cultivados nesse solo antigo, de camadas
                argilosas formadas por milhões de anos de história geológica.
              </p>
              <p>
                Ao pé da Serra da Canastra, onde o cerrado encontra o clima de altitude, Pedro percebeu
                que aquela terra tinha mais a oferecer. O mesmo solo que guardava a essência do café
                poderia guardar algo mais. E foi assim que ele começou a plantar as primeiras mudas de
                Syrah — na encosta onde os avós já pisavam.
              </p>
              <p>
                Antonio Terra é amigo de Pedro há mais tempo do que qualquer um se lembra com exatidão.
                A amizade entre as duas famílias precedia a deles — os pais já se conheciam, os avós
                também. Quando Pedro decidiu que aquela encosta merecia um vinho, Antonio estava ao lado.
                O sobrenome de um, a história de vida do outro: juntos formaram a Terrabras.
              </p>
            </div>

            <div className="flex flex-col justify-between gap-8">
              {[
                { valor: "70+", desc: "Anos de história familiar cultivando a mesma terra" },
                { valor: "1.350 m", desc: "Altitude onde o café premiado e o vinho dividem o mesmo solo" },
                { valor: "2024", desc: "Primeira safra — Syrah e Cabernet Franc, edição limitada" },
              ].map(({ valor, desc }) => (
                <div
                  key={valor}
                  className="flex items-start gap-7 pb-8 border-b border-[#18150E]/10 last:border-0 last:pb-0"
                >
                  <span
                    className="text-4xl font-light text-[#C4944A] leading-none shrink-0"
                    style={fontDisplay}
                  >
                    {valor}
                  </span>
                  <p className="text-sm text-[#18150E]/55 leading-relaxed pt-1 font-light">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TERROIR ────────────────────────────────────── */}
      <section id="terroir" className="py-28 px-6" style={{ background: "#161210" }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-[9px] tracking-[0.42em] uppercase text-[#C4944A]/80 font-light mb-3">
              O Terroir
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light" style={fontDisplay}>
              Solo. Altitude.
              <br />
              <span className="text-[#F2EDE4]/45">Tempo.</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-8">
              {[
                { valor: "1.350 m", label: "Altitude" },
                { valor: "Dupla Poda", label: "Técnica de Cultivo" },
                { valor: "Argiloso", label: "Tipo de Solo" },
                { valor: "Serra da Canastra", label: "Localização · MG" },
              ].map(({ valor, label }) => (
                <div key={label} className="border-l border-[#C4944A]/30 pl-5">
                  <p className="text-xl font-light text-[#F2EDE4]" style={fontDisplay}>
                    {valor}
                  </p>
                  <p className="text-[9px] tracking-[0.25em] uppercase text-[#F2EDE4]/35 font-light mt-1">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="lg:col-span-8 flex flex-col justify-center space-y-6 text-[#F2EDE4]/55 text-[0.95rem] leading-[1.95] font-light">
              <p>
                Ao pé da Serra da Canastra, em Minas Gerais, o vinhedo da Terrabras ocupa uma encosta
                a 1.350 metros de altitude. O solo carrega camadas argilosas formadas por milhões de
                anos de sedimentos — uma terra densa, rica, que guarda umidade e minerais como poucos
                solos no Brasil.
              </p>
              <p>
                As noites frescas da serra, mesmo no calor do verão tropical, preservam a acidez
                natural da uva e constroem aromas mais complexos e duradouros. O dia quente amadurece
                os taninos; a noite fria os refina.
              </p>
              <p>
                A técnica da <em>dupla poda</em> permite ajustar o ciclo da videira ao clima tropical
                — controlando quando a planta brota e quando colhe, extraindo o melhor do terroir em
                cada safra.
              </p>
              <Ornamento />
              <p
                className="text-[#F2EDE4]/35 text-base italic"
                style={fontDisplay}
              >
                "O mesmo solo que produziu cafés premiados como os melhores do Brasil —
                agora também expressa vinho."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── VINHOS ─────────────────────────────────────── */}
      <section id="vinhos" className="py-28 px-6" style={{ background: "#F2EDE4", color: "#18150E" }}>
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 text-center">
            <p className="text-[9px] tracking-[0.42em] uppercase text-[#C4944A] font-light mb-3">
              Os Vinhos
            </p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light" style={fontDisplay}>
              Safra 2024
            </h2>
            <Ornamento />
            <p className="text-sm text-[#18150E]/45 font-light max-w-sm mx-auto">
              Produção artesanal e extremamente limitada.
              Cada garrafa numerada. Cada safra, única.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              {
                nome: "Syrah",
                nota:
                  "Tinto encorpado, aromas de ameixa escura, especiarias e toque mineral. Taninos elegantes, final longo — expressão pura do terroir da Canastra.",
              },
              {
                nome: "Cabernet Franc",
                nota:
                  "Tinto elegante e aromático, notas de frutas vermelhas, pimentão maduro e ervas da Serra. Estrutura refinada, acidez viva, acabamento mineral.",
              },
            ].map(({ nome, nota }) => (
              <div
                key={nome}
                className="group border border-[#18150E]/10 hover:border-[#C4944A]/50 transition-all duration-500 p-10 text-center"
              >
                <div className="flex justify-center mb-8">
                  <GarrafaSVG className="text-[#18150E]/25 group-hover:text-[#C4944A]/40 transition-colors duration-500" />
                </div>

                <p className="text-[8px] tracking-[0.45em] uppercase text-[#C4944A] font-light mb-2">
                  Terrabras
                </p>
                <h3 className="text-3xl font-light mb-1" style={fontDisplay}>
                  {nome}
                </h3>
                <p className="text-[10px] tracking-[0.25em] text-[#18150E]/35 uppercase font-light mb-6">
                  Safra 2024
                </p>

                <div className="h-px bg-[#18150E]/8 mb-6" />

                <p className="text-sm text-[#18150E]/55 font-light leading-relaxed mb-7">{nota}</p>

                <div className="space-y-1.5 text-[9px] tracking-[0.22em] uppercase text-[#18150E]/35 font-light">
                  <p>Serra da Canastra · MG</p>
                  <p>1.350 m · Dupla Poda</p>
                  <p>Edição limitada · A partir de R$ 350</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CADASTRO ───────────────────────────────────── */}
      <section id="cadastro" className="py-28 px-6" style={{ background: "#0E0B06" }}>
        <div className="max-w-xl mx-auto text-center">
          <p className="text-[9px] tracking-[0.42em] uppercase text-[#C4944A]/75 font-light mb-4">
            Lista Exclusiva
          </p>
          <h2 className="text-4xl sm:text-5xl font-light mb-2" style={fontDisplay}>
            Cada safra é limitada.
          </h2>
          <Ornamento />
          <p className="text-[#F2EDE4]/45 font-light mb-12 text-sm leading-[1.9]">
            Inscreva-se para ser o primeiro a saber quando os vinhos estiverem disponíveis.
            <br />
            Produção artesanal. Sem segunda chance na prateleira.
          </p>

          {submitted ? (
            <div className="py-12">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full border border-[#C4944A]/35 mb-6">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path
                    d="M3 11 L8 16 L19 6"
                    stroke="#C4944A"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-3xl font-light text-[#C4944A] mb-2" style={fontDisplay}>
                Perfeito.
              </h3>
              <p className="text-[#F2EDE4]/40 font-light text-sm">
                Você está na lista. Entraremos em contato na próxima safra.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
              <div className="grid sm:grid-cols-2 gap-4">
                {(
                  [
                    { field: "nome", label: "Nome completo", placeholder: "Seu nome", type: "text" },
                    { field: "email", label: "E-mail", placeholder: "seu@email.com", type: "email" },
                    { field: "whatsapp", label: "WhatsApp", placeholder: "(11) 99999-9999", type: "tel" },
                    { field: "cidade", label: "Cidade", placeholder: "São Paulo", type: "text" },
                  ] as const
                ).map(({ field, label, placeholder, type }) => (
                  <div key={field}>
                    <label className="block text-[8px] tracking-[0.32em] uppercase text-[#F2EDE4]/35 font-light mb-2">
                      {label}
                    </label>
                    <input
                      {...register(field)}
                      type={type}
                      placeholder={placeholder}
                      className="w-full bg-transparent border border-[#F2EDE4]/12 focus:border-[#C4944A]/55 outline-none px-4 py-3.5 text-sm text-[#F2EDE4] placeholder:text-[#F2EDE4]/18 transition-colors"
                    />
                    {errors[field] && (
                      <p className="text-[9px] text-red-400/70 mt-1.5">{errors[field]?.message}</p>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 mt-3 bg-[#C4944A] text-[#18150E] text-[10px] tracking-[0.32em] uppercase font-medium hover:bg-[#D4A45A] disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isSubmitting ? "Enviando..." : "Garantir minha vaga na lista"}
              </button>

              {apiError && (
                <p className="text-center text-[10px] text-red-400/80 -mt-1">{apiError}</p>
              )}
              <p className="text-center text-[9px] text-[#F2EDE4]/18 font-light pt-1">
                Nenhum spam. Apenas quando os vinhos estiverem disponíveis.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────── */}
      <footer className="py-14 px-6 border-t border-[#F2EDE4]/5" style={{ background: "#0A0806" }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <TerrabrasLogo size={26} color="#C4944A" />
            <div>
              <p
                className="text-base tracking-[0.3em] uppercase font-light text-[#F2EDE4]/75"
                style={fontDisplay}
              >
                Terrabras
              </p>
              <p className="text-[8px] tracking-[0.22em] uppercase text-[#F2EDE4]/28 font-light">
                Serra da Canastra · Minas Gerais
              </p>
            </div>
          </div>

          <div className="flex items-center gap-7">
            {[
              ["#historia", "História"],
              ["#terroir", "Terroir"],
              ["#vinhos", "Vinhos"],
              ["#cadastro", "Contato"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="text-[9px] tracking-[0.2em] uppercase text-[#F2EDE4]/28 hover:text-[#C4944A]/60 transition-colors font-light"
              >
                {label}
              </a>
            ))}
          </div>

          <p className="text-[8px] tracking-[0.15em] text-[#F2EDE4]/18 font-light">
            © 2026 Terrabras · Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  )
}
