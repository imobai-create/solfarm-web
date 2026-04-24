import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function autenticado(request: NextRequest) {
  const key = request.headers.get("x-admin-key")
  return key === process.env.ADMIN_PASSWORD
}

export async function GET(request: NextRequest) {
  if (!autenticado(request)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 })
  }

  const cadastros = await prisma.cadastro.findMany({
    orderBy: { criadoEm: "desc" },
  })

  return NextResponse.json(cadastros)
}
