import Link from "next/link"
import { Leaf } from "lucide-react"

export const metadata = { title: "Termos de Uso — SolFarm", description: "Termos e condições de uso da plataforma SolFarm." }

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
          <h1 className="text-3xl font-black text-gray-900 mb-2">Termos de Uso</h1>
          <p className="text-gray-500 text-sm">Última atualização: Abril de 2026 · SolFarm Participações S/A — CNPJ 53.092.737/0001-48</p>
          <div className="mt-4 h-1 w-16 bg-green-600 rounded-full" />
        </div>

        <div className="prose prose-gray max-w-none space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Objeto e Aceitação</h2>
            <p>Estes Termos de Uso regulam o acesso e a utilização da plataforma SolFarm, de titularidade da <strong>SolFarm Participações S/A</strong>, CNPJ 53.092.737/0001-48, com sede no Brasil ("SolFarm", "nós" ou "plataforma").</p>
            <p className="mt-3">Ao acessar, cadastrar-se ou utilizar qualquer funcionalidade da plataforma, o usuário declara ter lido, compreendido e aceito integralmente estes Termos. Caso não concorde com qualquer disposição, recomendamos que não utilize a plataforma.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Cadastro e Responsabilidades do Usuário</h2>
            <p>Para utilizar os serviços da SolFarm, o usuário deve criar uma conta fornecendo informações verdadeiras, completas e atualizadas. O usuário é inteiramente responsável por:</p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 ml-4">
              <li>Manter a confidencialidade de suas credenciais de acesso;</li>
              <li>Todas as atividades realizadas em sua conta;</li>
              <li>Notificar imediatamente a SolFarm em caso de uso não autorizado;</li>
              <li>Garantir que as informações fornecidas sobre sua propriedade rural e produção sejam verídicas;</li>
              <li>Utilizar a plataforma em conformidade com a legislação brasileira vigente.</li>
            </ul>
            <p className="mt-3">É proibido compartilhar credenciais de acesso, criar contas em nome de terceiros sem autorização ou utilizar a plataforma para fins ilícitos.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Planos e Pagamentos</h2>
            <p>A SolFarm oferece os seguintes planos de assinatura:</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "FREE", price: "Gratuito", features: "1 área, 3 diagnósticos/mês" },
                { name: "CAMPO", price: "R$ 49/mês", features: "5 áreas, 20 diagnósticos/mês" },
                { name: "FAZENDA", price: "R$ 149/mês", features: "Áreas ilimitadas, diagnósticos ilimitados" },
              ].map(p => (
                <div key={p.name} className="border border-gray-200 rounded-xl p-4">
                  <p className="font-bold text-gray-900">{p.name}</p>
                  <p className="text-green-600 font-semibold text-sm mt-1">{p.price}</p>
                  <p className="text-gray-500 text-xs mt-1">{p.features}</p>
                </div>
              ))}
            </div>
            <p className="mt-4">Os valores são cobrados mensalmente via PIX, boleto bancário ou cartão de crédito, processados pelo gateway Asaas. O cancelamento pode ser feito a qualquer momento, com efeito ao final do período vigente. Não há reembolso proporcional de períodos já iniciados.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Propriedade Intelectual</h2>
            <p>A plataforma SolFarm, incluindo seu código-fonte, design, algoritmos, modelos de inteligência artificial, marca, logotipo e demais elementos, é de titularidade exclusiva da <strong>SolFarm Participações S/A</strong>, protegida pela Lei nº 9.609/98 (Lei de Software) e pela Lei nº 9.279/96 (Lei de Propriedade Industrial).</p>
            <p className="mt-3">O usuário recebe uma licença de uso pessoal, não exclusiva, intransferível e revogável para acessar a plataforma durante a vigência de sua assinatura. É vedada qualquer reprodução, cópia, modificação, distribuição ou engenharia reversa dos sistemas da SolFarm.</p>
            <p className="mt-3">Os dados e informações inseridos pelo usuário permanecem de sua propriedade. A SolFarm pode utilizá-los de forma anonimizada e agregada para melhorar os serviços, conforme descrito na Política de Privacidade.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. FARMCOIN — Token Utilitário</h2>
            <p>O FARMCOIN (símbolo: FARM) é um token utilitário interno da plataforma SolFarm, emitido na blockchain Polygon como ERC-20. O FARMCOIN:</p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 ml-4">
              <li><strong>Não é</strong> um investimento financeiro, valor mobiliário ou criptomoeda especulativa;</li>
              <li>Representa créditos de utilidade vinculados à produção agrícola ou geração de energia solar declarada pelo usuário;</li>
              <li>Pode ser utilizado dentro do ecossistema SolFarm para aquisição de serviços, produtos no marketplace e benefícios;</li>
              <li>Tem 30% de cada emissão automaticamente destinado à tesouraria da SolFarm Participações S/A;</li>
              <li>Não garante qualquer retorno financeiro ou liquidez externa.</li>
            </ul>
            <p className="mt-3">A SolFarm reserva-se o direito de modificar as condições de uso e emissão do FARMCOIN mediante aviso prévio de 30 dias.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Diagnósticos e Recomendações por IA</h2>
            <p>Os diagnósticos agronômicos gerados pela plataforma utilizam inteligência artificial e dados de fontes públicas (ANA, INPE, IBGE). Esses resultados têm caráter <strong>informativo e orientativo</strong>, não substituindo a consultoria de um engenheiro agrônomo habilitado pelo CREA/CFQ.</p>
            <p className="mt-3">A SolFarm não se responsabiliza por decisões de manejo, aplicação de defensivos ou investimentos realizados com base exclusivamente nos diagnósticos automáticos da plataforma.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Limitação de Responsabilidade</h2>
            <p>A SolFarm não se responsabiliza por:</p>
            <ul className="list-disc list-inside mt-3 space-y-1.5 ml-4">
              <li>Indisponibilidade temporária da plataforma por manutenção ou falhas de infraestrutura;</li>
              <li>Perdas decorrentes do uso indevido das credenciais pelo próprio usuário;</li>
              <li>Danos indiretos, lucros cessantes ou danos consequenciais;</li>
              <li>Conteúdo publicado por terceiros no marketplace ou comunidade;</li>
              <li>Variações no valor ou liquidez do FARMCOIN em mercados externos.</li>
            </ul>
            <p className="mt-3">Em qualquer hipótese, a responsabilidade máxima da SolFarm limita-se ao valor pago pelo usuário nos últimos 12 meses.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Modificações dos Termos</h2>
            <p>A SolFarm pode atualizar estes Termos a qualquer momento, com aviso prévio de 15 dias por e-mail. O uso continuado da plataforma após as alterações implica aceitação dos novos termos.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Foro e Lei Aplicável</h2>
            <p>Estes Termos são regidos pela legislação brasileira. Fica eleito o foro da <strong>Comarca de Belo Horizonte, Estado de Minas Gerais</strong>, para dirimir quaisquer controvérsias, com renúncia a qualquer outro, por mais privilegiado que seja.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contato</h2>
            <p>Dúvidas sobre estes Termos: <a href="mailto:contato@solfarm.com.br" className="text-green-600 hover:underline">contato@solfarm.com.br</a></p>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-100 mt-16 py-8 text-center text-sm text-gray-400">
        <p>© 2026 SolFarm Participações S/A · CNPJ 53.092.737/0001-48 ·{" "}
          <Link href="/privacidade" className="hover:text-green-600">Privacidade</Link> ·{" "}
          <Link href="/contato" className="hover:text-green-600">Contato</Link>
        </p>
      </footer>
    </div>
  )
}
