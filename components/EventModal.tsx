'use client'

import { useState, useEffect } from 'react'
import { Event } from '@/types'
import { formatDate, formatTime } from '@/lib/utils'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  event?: Event | null
  defaultDate?: Date
  onSave: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  onDelete?: (id: string) => Promise<void>
}

export default function EventModal({
  isOpen,
  onClose,
  event,
  defaultDate,
  onSave,
  onDelete,
}: EventModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('10:00')
  const [location, setLocation] = useState('')
  const [color, setColor] = useState('#4285f4')
  const [isSaving, setIsSaving] = useState(false)

  const colors = [
    { name: 'Blue', value: '#4285f4' },
    { name: 'Red', value: '#ea4335' },
    { name: 'Yellow', value: '#fbbc04' },
    { name: 'Green', value: '#34a853' },
    { name: 'Purple', value: '#9c27b0' },
    { name: 'Pink', value: '#e91e63' },
    { name: 'Orange', value: '#ff9800' },
    { name: 'Teal', value: '#009688' },
  ]

  useEffect(() => {
    if (event) {
      const start = new Date(event.startTime)
      const end = new Date(event.endTime)
      setTitle(event.title || '')
      setDescription(event.description || '')
      setStartDate(formatDate(start))
      setStartTime(start.toTimeString().slice(0, 5))
      setEndDate(formatDate(end))
      setEndTime(end.toTimeString().slice(0, 5))
      setLocation(event.location || '')
      setColor(event.color || '#4285f4')
    } else if (defaultDate) {
      const dateStr = formatDate(defaultDate)
      setStartDate(dateStr)
      setEndDate(dateStr)
    }
  }, [event, defaultDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const startDateTime = new Date(`${startDate}T${startTime}`)
      const endDateTime = new Date(`${endDate}T${endTime}`)

      if (endDateTime <= startDateTime) {
        alert('End time must be after start time')
        setIsSaving(false)
        return
      }

      await onSave({
        title,
        description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        location,
        color,
      })

      // Reset form
      if (!event) {
        setTitle('')
        setDescription('')
        setLocation('')
        setColor('#4285f4')
      }

      onClose()
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Failed to save event')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!event || !onDelete) return

    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await onDelete(event.id)
        onClose()
      } catch (error) {
        console.error('Error deleting event:', error)
        alert('Failed to delete event')
      }
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-medium text-google-text">
            {event ? 'Edit Event' : 'Create Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-google-text-light hover:text-google-text transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent text-google-text"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-google-text-light mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-google-text-light mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-google-text-light mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-google-text-light mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-google-text-light mb-1">
                Location (optional)
              </label>
              <input
                type="text"
                placeholder="Add location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-google-text-light mb-1">
                Description (optional)
              </label>
              <textarea
                placeholder="Add description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-google-blue focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-google-text-light mb-2">
                Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      color === c.value
                        ? 'border-gray-800 scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div>
              {event && onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-google-text hover:bg-gray-100 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-google-blue text-white rounded hover:bg-google-blue-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving...' : event ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

