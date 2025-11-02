import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single event
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    const event = await prisma.event.findUnique({
      where: { id },
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error: any) {
    console.error('Error fetching event:', error)
    // Handle Prisma connection errors
    if (error.code === 'P1001' || error.code === 'P1002') {
      return NextResponse.json(
        { error: 'Database connection failed. Please check your DATABASE_URL.' },
        { status: 503 }
      )
    }
    const message = process.env.NODE_ENV === 'production' ? 'Failed to fetch event' : (error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}

// PUT update event
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    const body = await request.json()
    const { title, description, startTime, endTime, color, location } = body

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Validate time order if both are provided
    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      )
    }

    const event = await prisma.event.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(endTime && { endTime: new Date(endTime) }),
        ...(color && { color }),
        ...(location !== undefined && { location }),
      },
    })

    return NextResponse.json(event)
  } catch (error: any) {
    console.error('Error updating event:', error)
    // Handle Prisma connection errors
    if (error.code === 'P1001' || error.code === 'P1002') {
      return NextResponse.json(
        { error: 'Database connection failed. Please check your DATABASE_URL.' },
        { status: 503 }
      )
    }
    // Handle Prisma known errors
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    const message = process.env.NODE_ENV === 'production' ? 'Failed to update event' : (error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}

// DELETE event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    await prisma.event.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting event:', error)
    // Handle Prisma connection errors
    if (error.code === 'P1001' || error.code === 'P1002') {
      return NextResponse.json(
        { error: 'Database connection failed. Please check your DATABASE_URL.' },
        { status: 503 }
      )
    }
    // Handle Prisma known errors
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    const message = process.env.NODE_ENV === 'production' ? 'Failed to delete event' : (error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}

