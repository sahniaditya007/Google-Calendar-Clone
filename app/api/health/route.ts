import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // simple lightweight query to verify DB connectivity
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json({ status: 'ok', database: 'connected' })
  } catch (error: any) {
    console.error('Health check failed:', error)
    // Handle Prisma connection errors
    if (error.code === 'P1001' || error.code === 'P1002') {
      return NextResponse.json(
        { status: 'error', error: 'Database connection failed. Please check your DATABASE_URL.', database: 'disconnected' },
        { status: 503 }
      )
    }
    const message = process.env.NODE_ENV === 'production' ? 'Database unreachable' : (error instanceof Error ? error.message : String(error))
    return NextResponse.json({ status: 'error', error: message, database: 'error' }, { status: 500 })
  }
}
