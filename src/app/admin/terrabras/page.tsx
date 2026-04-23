"use client"

import { useState } from "react"

type Cadastro = {
  id: string
  nome: string
  email: string
  whatsapp: string
  cidade: string
  criadoEm: string
}

const fontDisplay = { fontFamily: "var(--font-cormorant), Georgia, serif" }

export default function AdminPage() {
  const [senha, setSenha] = useState("")
  const [autenticado, setAutenticado] = useState(false)
  const [cadastros, setCadastros] = useState<Cadastro[]>([])
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [busca, setBusca] = useState("")

  async function entrar(e: React.FormEvent) {
    e.preventDefault()
    setErro("")
    setCarregando(true)
    const res = await fetch("/api/admin/cadastros", {
      headers: { "x-admin-key": senha },
    })
    setCarregando(false)
    if (!res.ok) { setErro("Senha incorreta."); return }
    const data = await res.json()
    setCadastros(data)
    setAutenticado(true)
  }

  function exportarCSV() {
    const a = document.createElement("a")
    a.href = "/api/admin/cadastros/export"
    a.download = "terrabras-lista.csv"
    // passa a key via header não é possível diretamente — usa query param
    a.href = `/api/admin/cadastros/export?key=${encodeURIComponent(senha)}`
    a.click()
  }

  const filtrados = cadastros.filter(
    (c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.email.toLowerCase().includes(busca.toLowerCase()) ||
      c.cidade.toLowerCase().includes(busca.toLowerCase())
  )

  if (!autenticado) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "#0E0B06" }}
      >
        <div className="w-full max-w-sm text-center">
          <div className="mb-8">
            <svg width="36" height="40" viewBox="0 0 40 44" fill="none" className="mx-auto mb-4">
              <ellipse cx="20" cy="23" rx="17" ry="19" stroke="#C4944A" strokeWidth="1.2" />
              <path d="M9 31 L14 22 L18 27 L21 19 L24 23 L28 17 L33 27" stroke="#C4944A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <p className="text-xs tracking-[0.35em] uppercase text-[#C4944A] font-light mb-1">Terrabras</p>
            <h1 className="text-3xl font-light text-[#F2EDE4]" style={fontDisplay}>
              Área Restrita
            </h1>
          </div>

          <form onSubmit={entrar} className="space-y-4">
            <div>
              <label className="block text-[9px] tracking-[0.3em] uppercase text-[#F2EDE4]/35 font-light mb-2 text-left">
                Senha
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent border border-[#F2EDE4]/12 focus:border-[#C4944A]/55 outline-none px-4 py-3.5 text-sm text-[#F2EDE4] placeholder:text-[#F2EDE4]/20 transition-colors"
              />
            </div>
            {erro && <p className="text-[10px] text-red-400/70">{erro}</p>}
            <button
              type="submit"
              disabled={carregando}
              className="w-full py-3.5 bg-[#C4944A] text-[#18150E] text-[10px] tracking-[0.3em] uppercase font-medium hover:bg-[#D4A45A] disabled:opacity-50 transition-colors cursor-pointer"
            >
              {carregando ? "Verificando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "#18150E", color: "#F2EDE4" }}>
      {/* Header */}
      <div className="border-b border-[#F2EDE4]/8 px-6 lg:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg width="24" height="27" viewBox="0 0 40 44" fill="none">
            <ellipse cx="20" cy="23" rx="17" ry="19" stroke="#C4944A" strokeWidth="1.2" />
            <path d="M9 31 L14 22 L18 27 L21 19 L24 23 L28 17 L33 27" stroke="#C4944A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
          <span className="text-sm tracking-[0.25em] uppercase font-light" style={fontDisplay}>
            Terrabras <span className="text-[#F2EDE4]/30">· Admin</span>
          </span>
        </div>
        <a href="/" className="text-[9px] tracking-[0.2em] uppercase text-[#F2EDE4]/30 hover:text-[#C4944A] transition-colors font-light">
          Ver site
        </a>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          {[
            { valor: cadastros.length, label: "Total de cadastros" },
            { valor: [...new Set(cadastros.map((c) => c.cidade))].length, label: "Cidades" },
            {
              valor: cadastros.filter((c) => {
                const d = new Date(c.criadoEm)
                const agora = new Date()
                return agora.getTime() - d.getTime() < 7 * 24 * 60 * 60 * 1000
              }).length,
              label: "Últimos 7 dias",
            },
          ].map(({ valor, label }) => (
            <div key={label} className="border border-[#F2EDE4]/8 p-6">
              <p className="text-3xl font-light text-[#C4944A] mb-1" style={fontDisplay}>
                {valor}
              </p>
              <p className="text-[9px] tracking-[0.2em] uppercase text-[#F2EDE4]/35 font-light">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Controles */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou cidade..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 bg-transparent border border-[#F2EDE4]/12 focus:border-[#C4944A]/50 outline-none px-4 py-3 text-sm text-[#F2EDE4] placeholder:text-[#F2EDE4]/20 transition-colors"
          />
          <button
            onClick={exportarCSV}
            className="px-6 py-3 border border-[#C4944A]/50 text-[#C4944A] text-[10px] tracking-[0.2em] uppercase font-light hover:bg-[#C4944A]/10 transition-colors whitespace-nowrap"
          >
            Exportar CSV
          </button>
        </div>

        {/* Tabela */}
        <div className="border border-[#F2EDE4]/8 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#F2EDE4]/8">
                {["Nome", "E-mail", "WhatsApp", "Cidade", "Data"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3.5 text-[9px] tracking-[0.25em] uppercase text-[#F2EDE4]/35 font-light"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-[#F2EDE4]/25 text-sm font-light">
                    {busca ? "Nenhum resultado." : "Nenhum cadastro ainda."}
                  </td>
                </tr>
              ) : (
                filtrados.map((c, i) => (
                  <tr
                    key={c.id}
                    className={`border-b border-[#F2EDE4]/5 hover:bg-[#F2EDE4]/3 transition-colors ${
                      i % 2 === 0 ? "" : "bg-[#F2EDE4]/[0.02]"
                    }`}
                  >
                    <td className="px-5 py-4 text-[#F2EDE4]/80 font-light">{c.nome}</td>
                    <td className="px-5 py-4 text-[#F2EDE4]/60 font-light">{c.email}</td>
                    <td className="px-5 py-4 text-[#F2EDE4]/60 font-light">{c.whatsapp}</td>
                    <td className="px-5 py-4 text-[#F2EDE4]/60 font-light">{c.cidade}</td>
                    <td className="px-5 py-4 text-[#F2EDE4]/40 font-light text-xs">
                      {new Date(c.criadoEm).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtrados.length > 0 && (
          <p className="text-right text-[9px] tracking-[0.15em] uppercase text-[#F2EDE4]/20 font-light mt-3">
            {filtrados.length} de {cadastros.length} cadastros
          </p>
        )}
      </div>
    </div>
  )
}
