import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'
import { compareRanks } from '@/constants/ranks'
import { fetchWithAuth } from '@/utils/api'

const API_URL = import.meta.env.VITE_API_URL

export const useEventStore = defineStore('events', {
  state: () => ({
    events: ref([]),
    loading: ref(false),
    error: ref(null)
  }),

  actions: {
    async fetchEvents() {
      this.loading = true
      try {
        const data = await fetchWithAuth('/api/events')
        this.events = data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async createEvent(event) {
      this.loading = true
      try {
        const data = await fetchWithAuth('/api/events', {
          method: 'POST',
          body: JSON.stringify(event)
        })
        this.events.push(data)
        return data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async attendEvent(eventId) {
      this.loading = true
      this.error = null

      try {
        const response = await fetch(`${API_URL}/api/events/${eventId}/attend`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.auth.token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to attend event')
        }

        // Update the local event with new attendee
        const eventIndex = this.events.findIndex(e => e.id === eventId)
        if (eventIndex !== -1) {
          this.events[eventIndex] = data
        }

        return data
      } catch (err) {
        console.error('Error attending event:', err)
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateEvent(id, updates) {
      this.loading = true
      this.error = null

      try {
        const response = await fetch(`${API_URL}/api/events/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(updates)
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to update event')
        }

        const index = this.events.findIndex(e => e.id === id)
        if (index !== -1) {
          this.events[index] = data
        }

        return data
      } catch (err) {
        console.error('Error updating event:', err)
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteEvent(id) {
      this.loading = true
      this.error = null

      try {
        const response = await fetch(`${API_URL}/api/events/${id}`, {
          method: 'DELETE',
          credentials: 'include'
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Failed to delete event')
        }

        this.events = this.events.filter(e => e.id !== id)
      } catch (err) {
        console.error('Error deleting event:', err)
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    }
  }
}) 