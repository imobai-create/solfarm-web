import Link from "next/link"
import { Leaf } from "lucide-react"

export const metadata = { title: "Política de Privacidade — SolFarm", description: "Como a SolFarm coleta, usa e protege seus dados pessoais." }

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black text-gray-900">Sol<span className="text-green-600">Farm</span></span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-green-600 transition-colors">← Voltar ao site</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Política de Privacidade</h1>
          <p className="text-gray-500 text-sm">Última atualização: Abril de 2026 · Em conformidade com a LGPD (Lei nº 13.709/2018)</p>
          <div className="mt-4 h-1 w-16 bg-green-600 rounded-full" />
        </div>

        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 mb-10">
          <p className="text-sm text-green-800 font-medium">
            <strong>Controladora dos Dados:</strong> SolFarm Participações S/A · CNPJ 53.092.737/0001-48<br />
            <strong>Encarregado (DPO):</strong> contato@solfarm.com.br<br />
            <strong>Site:</strong> solfarm.com.br
          </p>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Dados Coletados</h2>
            <p>A SolFarm coleta os seguintes dados pessoais e de uso:</p>
            <div className="mt-4 space-y-3">
              {[
                { cat: "Dados de Cadastro", items: "Nome completo, CPF/CNPJ, e-mail, telefone, estado e cidade" },
                { cat: "Dados da Propriedade", items: "Localização GPS das fazendas, tamanho em hectares, culturas, bioma e região" },
                { cat: "Dados de Produção", items: "Declarações de produção agrícola, colheitas, energia solar gerada (para emissão de FARMCOIN)" },
                { cat: "Dados de Uso", items: "Imagens enviadas para diagnóstico, histórico de análises, logs de acesso e dispositivo" },
                { cat: "Dados Financeiros", items: "Informações de pagamento processadas pelo gateway Asaas (não armazenamos dados de cartão diretamente)" },
                { cat: "Dados de Blockchain", items: "Endereço de carteira Polygon informado pelo usuário, transações FARMCOIN registradas on-chain" },
              ].map(({ cat, items }) => (
                <div key={cat} className="flex gap-3 p-4 border border-gray-100 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{cat}</p>
                    <p className="text-gray-600 text-sm mt-0.5">{items}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Finalidade do Tratamento</h2>
            <p>Seus dados são utilizados exclusivamente para:</p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 ml-4">
              <li>Prestação dos serviços contratados (diagnóstico, satélite, marketplace);</li>
              <li>Processamento de pagamentos e gestão de assinaturas;</li>
              <li>Emissão e rastreamento de FARMCOINS;</li>
              <li>Envio de notificações transacionais e alertas agronômicos;</li>
              <li>Melhoria contínua da plataforma e dos modelos de IA (de forma anonimizada);</li>
              <li>Cumprimento de obrigações legais e regulatórias.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Compartilhamento de Dados</h2>
            <p>A SolFarm <strong>não vende dados pessoais</strong>. Compartilhamos dados apenas com:</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: "Asaas", desc: "Gateway de pagamentos (PIX, boleto, cartão)" },
                { name: "Anthropic", desc: "Processamento de imagens pela IA Claude Vision" },
                { name: "Resend", desc: "Envio de e-mails transacionais" },
                { name: "Cloudinary", desc: "Armazenamento de imagens enviadas" },
                { name: "Railway / Vercel", desc: "Infraestrutura de hospedagem (servidores no Brasil/EUA)" },
                { name: "Polygon (blockchain)", desc: "Endereços de carteira e transações FARMCOIN (dados públicos)" },
              ].map(({ name, desc }) => (
                <div key={name} className="flex gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{name}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-500">Todos os parceiros seguem padrões de segurança compatíveis com a LGPD e GDPR.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Direitos do Titular (LGPD — Arts. 17 a 22)</h2>
            <p>Você tem direito a:</p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 ml-4">
              <li><strong>Confirmação e acesso:</strong> saber quais dados temos sobre você;</li>
              <li><strong>Correção:</strong> atualizar dados incompletos, inexatos ou desatualizados;</li>
              <li><strong>Anonimização ou eliminação:</strong> de dados desnecessários ou excessivos;</li>
              <li><strong>Portabilidade:</strong> receber seus dados em formato estruturado;</li>
              <li><strong>Revogação do consentimento:</strong> a qualquer momento, para dados tratados com base no consentimento;</li>
              <li><strong>Oposição:</strong> ao tratamento realizado com fundamento diverso do consentimento;</li>
              <li><strong>Eliminação:</strong> dos dados pessoais tratados com base no consentimento.</li>
            </ul>
            <p className="mt-4">Para exercer seus direitos, entre em contato com nosso DPO: <a href="mailto:contato@solfarm.com.br" className="text-green-600 hover:underline">contato@solfarm.com.br</a>. Responderemos em até 15 dias úteis.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Retenção de Dados</h2>
            <p>Mantemos seus dados pelo tempo necessário à prestação dos serviços e pelo prazo de <strong>5 anos após o encerramento da conta</strong>, para cumprimento de obrigações legais (Código Civil, art. 206).</p>
            <p className="mt-3">Dados de transações financeiras são retidos por 10 anos (Lei nº 9.613/98). Dados de blockchain são permanentes e públicos por natureza.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Cookies e Rastreamento</h2>
            <p>Utilizamos:</p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 ml-4">
              <li><strong>Cookies funcionais:</strong> necessários para autenticação e funcionamento da plataforma;</li>
              <li><strong>Cookies analíticos:</strong> para métricas de uso anonimizadas, visando melhorar a experiência.</li>
            </ul>
            <p className="mt-3">Não utilizamos cookies de publicidade ou rastreamento comportamental de terceiros.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Segurança</h2>
            <p>Adotamos medidas técnicas e administrativas para proteger seus dados, incluindo: criptografia em trânsito (HTTPS/TLS), senhas armazenadas com hash bcrypt, tokens JWT com expiração, controle de acesso por perfil (RBAC) e monitoramento de acessos.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Contato</h2>
            <p>
              <strong>Encarregado de Dados (DPO):</strong><br />
              E-mail: <a href="mailto:contato@solfarm.com.br" className="text-green-600 hover:underline">contato@solfarm.com.br</a><br />
              Empresa: SolFarm Participações S/A · CNPJ 53.092.737/0001-48
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-100 mt-16 py-8 text-center text-sm text-gray-400">
        <p>© 2026 SolFarm Participações S/A · CNPJ 53.092.737/0001-48 ·{" "}
          <Link href="/termos" className="hover:text-green-600">Termos de Uso</Link> ·{" "}
          <Link href="/contato" className="hover:text-green-600">Contato</Link>
        </p>
      </footer>
    </div>
  )
}
