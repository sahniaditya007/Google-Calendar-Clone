'use client'

import { useState, useEffect } from 'react'
import { Event, ViewType } from '@/types'
import Calendar from '@/components/Calendar'
import EventModal from '@/components/EventModal'
import {
  format,
  startOfMonth,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
} from 'date-fns'

export default function Home() {
  const [events, setEvents] = useState<Event[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<ViewType>('month')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [currentDate, view])

  const fetchEvents = async () => {
    try {
      setIsLoading(true)
      let startDate: Date
      let endDate: Date

      if (view === 'month') {
        startDate = startOfMonth(currentDate)
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
      } else if (view === 'week') {
        const weekStart = new Date(currentDate)
        weekStart.setDate(currentDate.getDate() - currentDate.getDay())
        startDate = weekStart
        endDate = new Date(weekStart)
        endDate.setDate(weekStart.getDate() + 6)
      } else {
        startDate = new Date(currentDate)
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date(currentDate)
        endDate.setHours(23, 59, 59, 999)
      }

      const response = await fetch(
        `/api/events?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      )
      const data = await response.json()

      // If the API returned an error object, avoid setting events to a non-iterable value
      if (!response.ok) {
        console.error('API error fetching events:', data)
        setEvents([])
      } else {
        setEvents(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateEvent = async (
    eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create event')
      }

      const newEvent = await response.json()
      // Refresh events to get the latest data from the server
      await fetchEvents()
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  }

  const handleUpdateEvent = async (
    id: string,
    eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update event')
      }

      // Refresh events to get the latest data from the server
      await fetchEvents()
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  }

  const handleDeleteEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete event')
      }

      // Refresh events to get the latest data from the server
      await fetchEvents()
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setSelectedEvent(null)
    setIsModalOpen(true)
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setSelectedDate(undefined)
    setIsModalOpen(true)
  }

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (view === 'month') {
      setCurrentDate(
        direction === 'next'
          ? addMonths(currentDate, 1)
          : subMonths(currentDate, 1)
      )
    } else if (view === 'week') {
      setCurrentDate(
        direction === 'next'
          ? addWeeks(currentDate, 1)
          : subWeeks(currentDate, 1)
      )
    } else {
      setCurrentDate(
        direction === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1)
      )
    }
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const getDateRangeText = () => {
    if (view === 'month') {
      return format(currentDate, 'MMMM yyyy')
    } else if (view === 'week') {
      const weekStart = new Date(currentDate)
      weekStart.setDate(currentDate.getDate() - currentDate.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`
    } else {
      return format(currentDate, 'EEEE, MMMM d, yyyy')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-google-blue flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h1 className="text-xl font-normal text-google-text">Calendar</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-google-blue text-white rounded hover:bg-google-blue-hover transition-colors flex items-center gap-2 shadow-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavigate('prev')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5 text-google-text"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleNavigate('next')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5 text-google-text"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
              <button
                onClick={handleToday}
                className="px-4 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors text-google-text"
              >
                Today
              </button>
              <h2 className="ml-4 text-xl font-normal text-google-text">
                {getDateRangeText()}
              </h2>
            </div>

            <div className="flex items-center gap-1 border border-gray-300 rounded overflow-hidden">
              {(['month', 'week', 'day'] as ViewType[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-1.5 text-sm font-medium transition-colors capitalize ${
                    view === v
                      ? 'bg-google-blue text-white'
                      : 'text-google-text hover:bg-gray-100'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Calendar */}
      <main className="max-w-full mx-auto px-4 py-4 h-[calc(100vh-180px)]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-google-text-light">Loading...</div>
          </div>
        ) : (
          <Calendar
            events={events}
            currentDate={currentDate}
            view={view}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        )}
      </main>

      {/* Event Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedEvent(null)
          setSelectedDate(undefined)
        }}
        event={selectedEvent}
        defaultDate={selectedDate}
        onSave={async (eventData) => {
          if (selectedEvent) {
            await handleUpdateEvent(selectedEvent.id, eventData)
          } else {
            await handleCreateEvent(eventData)
          }
        }}
        onDelete={selectedEvent ? handleDeleteEvent : undefined}
      />
    </div>
  )
}

