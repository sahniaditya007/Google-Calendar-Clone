import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // simple lightweight query to verify DB connectivity
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Health check failed:', error)
    const message = process.env.NODE_ENV === 'production' ? 'Database unreachable' : (error instanceof Error ? error.message : String(error))
    return NextResponse.json({ status: 'error', error: message }, { status: 500 })
  }
}
