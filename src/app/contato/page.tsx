"use client"

import Link from "next/link"
import { useState } from "react"
import { Leaf, Mail, Phone, Globe, Clock, CheckCircle2, Send } from "lucide-react"

export default function ContatoPage() {
  const [form, setForm] = useState({ nome: "", email: "", assunto: "", mensagem: "" })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black text-gray-900">Sol<span className="text-green-600">Farm</span></span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-green-600 transition-colors">← Voltar ao site</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Fale Conosco</h1>
          <p className="text-gray-500">Tire suas dúvidas, envie sugestões ou solicite suporte técnico.</p>
          <div className="mt-4 h-1 w-16 bg-green-600 rounded-full" />
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Formulário */}
          <div className="lg:col-span-3">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Mensagem enviada!</h2>
                <p className="text-gray-500 max-w-sm">Recebemos seu contato e responderemos em até 24 horas úteis no e-mail informado.</p>
                <button onClick={() => { setSent(false); setForm({ nome:"", email:"", assunto:"", mensagem:"" }) }}
                  className="mt-2 text-sm text-green-600 hover:underline">
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome completo *</label>
                    <input required type="text" value={form.nome}
                      onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
                      placeholder="Seu nome"
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail *</label>
                    <input required type="email" value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="seu@email.com"
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Assunto *</label>
                  <select required value={form.assunto}
                    onChange={e => setForm(f => ({ ...f, assunto: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 text-gray-700">
                    <option value="">Selecione um assunto</option>
                    <option>Suporte técnico</option>
                    <option>Dúvidas sobre planos</option>
                    <option>FARMCOIN e blockchain</option>
                    <option>Parceria comercial</option>
                    <option>Imprensa</option>
                    <option>Privacidade e dados pessoais</option>
                    <option>Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mensagem *</label>
                  <textarea required value={form.mensagem}
                    onChange={e => setForm(f => ({ ...f, mensagem: e.target.value }))}
                    rows={6} placeholder="Descreva sua dúvida ou mensagem..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 resize-none" />
                </div>
                <button type="submit" disabled={loading}
                  className="flex items-center justify-center gap-2 w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 text-sm">
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Enviando...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Enviar mensagem</>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Informações */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-gray-900">Informações de contato</h2>
              {[
                { icon: Mail,  label: "E-mail", value: "contato@solfarm.com.br", href: "mailto:contato@solfarm.com.br" },
                { icon: Phone, label: "WhatsApp", value: "31.99294.1888", href: "https://wa.me/5531992941888" },
                { icon: Globe, label: "Site", value: "solfarm.com.br", href: "https://solfarm.com.br" },
                { icon: Clock, label: "Horário", value: "Seg–Sex, 8h às 18h", href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-green-100 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">{label}</p>
                    {href ? (
                      <a href={href} target={href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-green-700 hover:underline">{value}</a>
                    ) : (
                      <p className="text-sm font-semibold text-gray-800">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-gray-100 rounded-2xl p-6">
              <h2 className="font-bold text-gray-900 mb-2">Tempo de resposta</h2>
              <p className="text-sm text-gray-500">Respondemos em até <strong className="text-gray-800">24 horas úteis</strong>. Para urgências técnicas, use o WhatsApp.</p>
            </div>

            <div className="border border-gray-100 rounded-2xl p-6">
              <h2 className="font-bold text-gray-900 mb-2">SolFarm Participações S/A</h2>
              <p className="text-sm text-gray-500">CNPJ 53.092.737/0001-48</p>
              <p className="text-sm text-gray-500 mt-1">Belo Horizonte, Minas Gerais</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 mt-16 py-8 text-center text-sm text-gray-400">
        <p>© 2026 SolFarm Participações S/A ·{" "}
          <Link href="/termos" className="hover:text-green-600">Termos de Uso</Link> ·{" "}
          <Link href="/privacidade" className="hover:text-green-600">Privacidade</Link>
        </p>
      </footer>
    </div>
  )
}
