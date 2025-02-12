import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const EVENTS_FILE = path.join(__dirname, '../data/events.json')

class EventService {
  async getEvents(filters = {}) {
    const data = JSON.parse(await fs.readFile(EVENTS_FILE, 'utf8'))
    let events = data.events

    if (filters.organizer) {
      events = events.filter(e => e.organizer === filters.organizer)
    }
    if (filters.attendee) {
      events = events.filter(e => e.attendees.includes(filters.attendee))
    }
    if (filters.type) {
      events = events.filter(e => e.type === filters.type)
    }

    return events
  }

  async createEvent(eventData) {
    const data = JSON.parse(await fs.readFile(EVENTS_FILE, 'utf8'))
    
    const newEvent = {
      id: `event-${Date.now()}`,
      ...eventData,
      attendees: [],
      status: 'SCHEDULED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    data.events.push(newEvent)
    await fs.writeFile(EVENTS_FILE, JSON.stringify(data, null, 2))
    return newEvent
  }

  async updateEvent(id, updates) {
    const data = JSON.parse(await fs.readFile(EVENTS_FILE, 'utf8'))
    const event = data.events.find(e => e.id === id)
    
    if (!event) {
      throw new Error('Event not found')
    }

    Object.assign(event, updates, {
      updatedAt: new Date().toISOString()
    })

    await fs.writeFile(EVENTS_FILE, JSON.stringify(data, null, 2))
    return event
  }

  async addAttendee(eventId, username) {
    const data = JSON.parse(await fs.readFile(EVENTS_FILE, 'utf8'))
    const event = data.events.find(e => e.id === eventId)
    
    if (!event) {
      throw new Error('Event not found')
    }

    if (!event.attendees.includes(username)) {
      event.attendees.push(username)
      event.updatedAt = new Date().toISOString()
      await fs.writeFile(EVENTS_FILE, JSON.stringify(data, null, 2))
    }

    return event
  }

  async removeAttendee(eventId, username) {
    const data = JSON.parse(await fs.readFile(EVENTS_FILE, 'utf8'))
    const event = data.events.find(e => e.id === eventId)
    
    if (!event) {
      throw new Error('Event not found')
    }

    event.attendees = event.attendees.filter(a => a !== username)
    event.updatedAt = new Date().toISOString()
    await fs.writeFile(EVENTS_FILE, JSON.stringify(data, null, 2))
    return event
  }
}

export default new EventService() 