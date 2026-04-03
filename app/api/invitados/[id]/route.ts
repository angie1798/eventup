import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET uno
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const invitado = await prisma.invitados.findUnique({
    where: { id: parseInt(params.id) }
  })

  return NextResponse.json(invitado)
}

// PATCH
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const body = await req.json()

  const actualizado = await prisma.invitados.update({
    where: { id: parseInt(id) },
    data: body
  })

  return NextResponse.json(actualizado)
}

// DELETE
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  await prisma.invitados.delete({
    where: { id: parseInt(id) }
  })

  return NextResponse.json({ ok: true })
}