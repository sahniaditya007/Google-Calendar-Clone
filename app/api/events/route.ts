import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all events
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    // Build query to find events that overlap with the date range
    // An event overlaps if: event.startTime <= range.end AND event.endTime >= range.start
    const where: any = {}
    
    if (start && end) {
      where.AND = [
        { startTime: { lte: new Date(end) } },
        { endTime: { gte: new Date(start) } },
      ]
    } else if (start) {
      where.endTime = { gte: new Date(start) }
    } else if (end) {
      where.startTime = { lte: new Date(end) }
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { startTime: 'asc' },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// POST create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, startTime, endTime, color, location } = body

    // Validate required fields
    if (!title || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Title, startTime, and endTime are required' },
        { status: 400 }
      )
    }

    // Validate time order
    if (new Date(startTime) >= new Date(endTime)) {
      return NextResponse.json(
        { error: 'End time must be after start time' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        color: color || '#4285f4',
        location,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}

