import Link from "next/link"
import { Leaf, Key, Terminal, Zap, Lock } from "lucide-react"

export const metadata = { title: "API Docs — SolFarm", description: "Documentação da API pública da plataforma SolFarm." }

const BASE_URL = "https://solfarm-api-production.up.railway.app"

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  return (
    <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-x-auto leading-relaxed font-mono">
      {code}
    </pre>
  )
}

function Badge({ label, color }: { label: string; color: string }) {
  const colors: Record<string, string> = {
    GET:    "bg-blue-100 text-blue-700",
    POST:   "bg-green-100 text-green-700",
    PATCH:  "bg-yellow-100 text-yellow-700",
    DELETE: "bg-red-100 text-red-700",
  }
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-md font-mono ${colors[color] ?? "bg-gray-100 text-gray-600"}`}>{label}</span>
}

const endpoints = [
  {
    method: "POST", path: "/auth/login", auth: false,
    desc: "Autentica o usuário e retorna o accessToken JWT.",
    body: `{ "email": "seu@email.com", "password": "suasenha" }`,
    response: `{ "accessToken": "eyJ...", "user": { "id": "...", "name": "João", "plan": "CAMPO" } }`,
  },
  {
    method: "GET", path: "/areas", auth: true,
    desc: "Lista todas as áreas/talhões do usuário autenticado.",
    body: null,
    response: `{ "areas": [{ "id": "...", "name": "Talhão 1", "hectares": 450.5, "culture": "SOJA" }] }`,
  },
  {
    method: "POST", path: "/scan", auth: true,
    desc: "Envia uma imagem (base64) e coordenadas GPS para diagnóstico agronômico por IA.",
    body: `{ "image": "<base64>", "latitude": -13.5, "longitude": -49.2 }`,
    response: `{ "score": 78, "healthStatus": "BOM", "diagnosis": "...", "recommendations": [...] }`,
  },
  {
    method: "GET", path: "/farmcoin/balance", auth: true,
    desc: "Retorna o saldo de FARMCOINS do usuário no ledger interno.",
    body: null,
    response: `{ "balance": 250.00, "currency": "FARM", "onchain": false }`,
  },
  {
    method: "GET", path: "/farmcoin/contract", auth: true,
    desc: "Retorna informações do contrato ERC-20 na blockchain Polygon.",
    body: null,
    response: `{ "onchain": true, "contractAddress": "0x55cB...", "totalSupply": 1200.00, "platformFeePercent": 30 }`,
  },
  {
    method: "GET", path: "/diagnostics", auth: true,
    desc: "Lista o histórico de diagnósticos do usuário.",
    body: null,
    response: `{ "diagnostics": [{ "id": "...", "score": 82, "healthStatus": "OTIMO", "createdAt": "..." }] }`,
  },
]

export default function ApiDocsPage() {
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
        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-black text-gray-900">API SolFarm</h1>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">BETA</span>
          </div>
          <p className="text-gray-500 max-w-2xl">A API REST da SolFarm está disponível em beta para parceiros e integradores. Todos os endpoints retornam JSON e utilizam autenticação via Bearer Token JWT.</p>
          <div className="mt-4 h-1 w-16 bg-green-600 rounded-full" />
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Terminal, label: "Base URL", value: BASE_URL, mono: true },
            { icon: Key,      label: "Autenticação", value: "Bearer Token (JWT)" },
            { icon: Zap,      label: "Formato", value: "JSON · REST · HTTPS" },
          ].map(({ icon: Icon, label, value, mono }) => (
            <div key={label} className="border border-gray-100 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-green-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                <p className={`text-sm font-semibold text-gray-800 mt-0.5 truncate ${mono ? "font-mono text-xs" : ""}`}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Autenticação */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-green-600" /> Autenticação
          </h2>
          <p className="text-gray-600 mb-4 text-sm">Faça login para obter o <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">accessToken</code> e inclua-o no header de todas as requisições autenticadas:</p>
          <CodeBlock code={`# 1. Login
curl -X POST ${BASE_URL}/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"seu@email.com","password":"suasenha"}'

# 2. Use o token retornado
curl ${BASE_URL}/areas \\
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"`} />
        </section>

        {/* Endpoints */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Endpoints</h2>
          <div className="space-y-6">
            {endpoints.map((ep, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-4 bg-gray-50 border-b border-gray-100">
                  <Badge label={ep.method} color={ep.method} />
                  <code className="text-sm font-mono font-bold text-gray-800">{ep.path}</code>
                  {ep.auth && (
                    <span className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                      <Lock className="w-3 h-3" /> auth
                    </span>
                  )}
                </div>
                <div className="px-5 py-4 space-y-4">
                  <p className="text-sm text-gray-600">{ep.desc}</p>
                  {ep.body && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Body (JSON)</p>
                      <CodeBlock code={ep.body} lang="json" />
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Resposta</p>
                    <CodeBlock code={ep.response} lang="json" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Exemplo JavaScript */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Exemplo em JavaScript</h2>
          <CodeBlock lang="js" code={`const BASE = "${BASE_URL}"

// Login
const { accessToken } = await fetch(\`\${BASE}/auth/login\`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "seu@email.com", password: "senha" })
}).then(r => r.json())

// Buscar áreas
const { areas } = await fetch(\`\${BASE}/areas\`, {
  headers: { Authorization: \`Bearer \${accessToken}\` }
}).then(r => r.json())

console.log(areas)`} />
        </section>

        {/* Solicitar acesso */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Solicitar Acesso à API</h2>
          <p className="text-gray-600 text-sm mb-5 max-w-md mx-auto">A API está em beta fechado. Para integrações, parcerias ou acesso antecipado, entre em contato com nossa equipe.</p>
          <a href="mailto:contato@solfarm.com.br?subject=Solicitar acesso API SolFarm"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors">
            <Key className="w-4 h-4" />
            Solicitar acesso — contato@solfarm.com.br
          </a>
        </div>
      </main>

      <footer className="border-t border-gray-100 mt-16 py-8 text-center text-sm text-gray-400">
        <p>© 2026 SolFarm Participações S/A ·{" "}
          <Link href="/termos" className="hover:text-green-600">Termos de Uso</Link> ·{" "}
          <Link href="/privacidade" className="hover:text-green-600">Privacidade</Link> ·{" "}
          <Link href="/contato" className="hover:text-green-600">Contato</Link>
        </p>
      </footer>
    </div>
  )
}
