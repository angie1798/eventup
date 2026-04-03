import connectionPool from '../../../db';
import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function GET() {
  try {
    const invitados = await prisma.invitados.findMany()
    return NextResponse.json(invitados);
  } catch (error) {
    console.error('Error fetching invitados:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}