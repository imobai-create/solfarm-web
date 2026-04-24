import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function autenticado(request: NextRequest) {
  const key =
    request.headers.get("x-admin-key") ??
    request.nextUrl.searchParams.get("key")
  return key === process.env.ADMIN_PASSWORD
}

export async function GET(request: NextRequest) {
  if (!autenticado(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const cadastros = await prisma.cadastro.findMany({
    orderBy: { criadoEm: "desc" },
  })

  const linhas = [
    ["Nome", "E-mail", "WhatsApp", "Cidade", "Data"].join(";"),
    ...cadastros.map((c) =>
      [
        c.nome,
        c.email,
        c.whatsapp,
        c.cidade,
        new Date(c.criadoEm).toLocaleString("pt-BR"),
      ].join(";")
    ),
  ].join("\n")

  return new NextResponse(linhas, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="terrabras-lista-${Date.now()}.csv"`,
    },
  })
}
