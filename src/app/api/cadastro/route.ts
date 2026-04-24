import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const schema = z.object({
  nome:     z.string().min(2),
  email:    z.string().email(),
  whatsapp: z.string().min(10),
  cidade:   z.string().min(2),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = schema.parse(body)

    const existente = await prisma.cadastro.findUnique({ where: { email: data.email } })
    if (existente) {
      return NextResponse.json(
        { error: "Este e-mail já está na lista." },
        { status: 409 }
      )
    }

    const cadastro = await prisma.cadastro.create({ data })
    return NextResponse.json({ ok: true, id: cadastro.id }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 })
    }
    console.error("[cadastro]", err)
    return NextResponse.json({ error: "Erro interno." }, { status: 500 })
  }
}
