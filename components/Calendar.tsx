'use client'

import { useState, useEffect } from 'react'
import { Event, ViewType } from '@/types'
import {
  getDaysInMonth,
  getWeekDates,
  isToday,
  isSameDay,
  getEventsForDay,
  checkEventOverlap,
  formatDate,
} from '@/lib/utils'
import { format } from 'date-fns'

interface CalendarProps {
  events: Event[]
  currentDate: Date
  view: ViewType
  onDateClick: (date: Date) => void
  onEventClick: (event: Event) => void
}

export default function Calendar({
  events,
  currentDate,
  view,
  onDateClick,
  onEventClick,
}: CalendarProps) {
  const [overlaps] = useState(() => checkEventOverlap(events))

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate)
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
      <div className="flex-1 flex flex-col">
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-2 text-xs font-medium text-google-text-light text-center"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1">
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(events, day)
            const isCurrentMonth = day.getMonth() === currentDate.getMonth()
            const isTodayDate = isToday(day)

            return (
              <div
                key={index}
                className={`min-h-[100px] border-r border-b border-gray-200 p-1 ${
                  !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                } hover:bg-gray-50 transition-colors cursor-pointer`}
                onClick={() => onDateClick(day)}
              >
                <div
                  className={`text-sm mb-1 ${
                    isTodayDate
                      ? 'bg-google-blue text-white rounded-full w-6 h-6 flex items-center justify-center font-medium'
                      : isCurrentMonth
                      ? 'text-google-text'
                      : 'text-gray-400'
                  }`}
                >
                  {day.getDate()}
                </div>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                      className="event-item text-xs px-2 py-0.5 rounded truncate cursor-pointer"
                      style={{
                        backgroundColor: `${event.color}20`,
                        color: event.color,
                        borderLeft: `3px solid ${event.color}`,
                      }}
                    >
                      {format(new Date(event.startTime), 'h:mm a')} {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-google-text-light px-2">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const weekDays = getWeekDates(currentDate)
    const weekDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <div className="grid grid-cols-8 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="p-2 border-r border-gray-200"></div>
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="p-2 text-center border-r border-gray-200 last:border-r-0"
            >
              <div className="text-xs text-google-text-light">
                {weekDayNames[index]}
              </div>
              <div
                className={`text-lg font-medium ${
                  isToday(day)
                    ? 'bg-google-blue text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto'
                    : 'text-google-text'
                }`}
              >
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1 grid grid-cols-8">
          <div className="border-r border-gray-200">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-16 border-b border-gray-100 text-xs text-google-text-light px-2 pt-1"
              >
                {hour === 0
                  ? '12 AM'
                  : hour < 12
                  ? `${hour} AM`
                  : hour === 12
                  ? '12 PM'
                  : `${hour - 12} PM`}
              </div>
            ))}
          </div>
          {weekDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDay(events, day)
            return (
              <div
                key={dayIndex}
                className="border-r border-gray-200 last:border-r-0 relative"
              >
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-16 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      const date = new Date(day)
                      date.setHours(hour, 0, 0, 0)
                      onDateClick(date)
                    }}
                  />
                ))}
                {dayEvents.map((event) => {
                  const start = new Date(event.startTime)
                  const end = new Date(event.endTime)
                  const startHour = start.getHours() + start.getMinutes() / 60
                  const endHour = end.getHours() + end.getMinutes() / 60
                  const duration = endHour - startHour
                  const top = (startHour / 24) * 100
                  const height = (duration / 24) * 100

                  return (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                      className="absolute left-0 right-0 mx-1 px-2 py-1 rounded event-item cursor-pointer text-xs overflow-hidden"
                      style={{
                        top: `${top}%`,
                        height: `${Math.max(height, 3)}%`,
                        backgroundColor: event.color,
                        color: 'white',
                        minHeight: '20px',
                      }}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-[10px] opacity-90">
                        {format(start, 'h:mm a')} - {format(end, 'h:mm a')}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const dayEvents = getEventsForDay(events, currentDate)

    return (
      <div className="flex-1 flex overflow-auto">
        <div className="w-20 border-r border-gray-200">
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-16 border-b border-gray-100 text-xs text-google-text-light px-2 pt-1"
            >
              {hour === 0
                ? '12 AM'
                : hour < 12
                ? `${hour} AM`
                : hour === 12
                ? '12 PM'
                : `${hour - 12} PM`}
            </div>
          ))}
        </div>
        <div className="flex-1 relative">
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-16 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => {
                const date = new Date(currentDate)
                date.setHours(hour, 0, 0, 0)
                onDateClick(date)
              }}
            />
          ))}
          {dayEvents.map((event) => {
            const start = new Date(event.startTime)
            const end = new Date(event.endTime)
            const startHour = start.getHours() + start.getMinutes() / 60
            const endHour = end.getHours() + end.getMinutes() / 60
            const duration = endHour - startHour
            const top = (startHour / 24) * 100
            const height = (duration / 24) * 100

            return (
              <div
                key={event.id}
                onClick={(e) => {
                  e.stopPropagation()
                  onEventClick(event)
                }}
                className="absolute left-2 right-2 px-3 py-2 rounded event-item cursor-pointer shadow-sm"
                style={{
                  top: `${top}%`,
                  height: `${Math.max(height, 5)}%`,
                  backgroundColor: event.color,
                  color: 'white',
                  minHeight: '60px',
                }}
              >
                <div className="font-medium">{event.title}</div>
                <div className="text-sm opacity-90">
                  {format(start, 'h:mm a')} - {format(end, 'h:mm a')}
                </div>
                {event.location && (
                  <div className="text-xs opacity-80 mt-1">
                    📍 {event.location}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (view === 'month') return renderMonthView()
  if (view === 'week') return renderWeekView()
  return renderDayView()
}

