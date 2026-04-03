import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { invitados } = body

    const result = await prisma.invitados.createMany({
      data: invitados,
      skipDuplicates: true
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error creando invitados' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const { ids, estado } = body

    const resultado = await prisma.invitados.updateMany({
      where: {
        id: {
          in: ids // ← lista de IDs
        }
      },
      data: {
        estado
      }
    })

    return NextResponse.json(resultado)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error actualizando invitados' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()

    const { ids } = body

    const resultado = await prisma.invitados.deleteMany({
      where: {
        id: {
          in: ids // ← lista de IDs
        }
      }
    })

    return NextResponse.json(resultado)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Error eliminando invitados' },
      { status: 500 }
    )
  }
}