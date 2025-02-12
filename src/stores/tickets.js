import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './auth'
import { fetchWithAuth } from '@/utils/api'

const API_URL = import.meta.env.VITE_API_URL

export const useTicketStore = defineStore('tickets', {
  state: () => ({
    tickets: ref([]),
    loading: ref(false),
    error: ref(null)
  }),

  actions: {
    async fetchTickets() {
      this.loading = true
      try {
        const data = await fetchWithAuth('/api/tickets')
        this.tickets = data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async createTicket(ticket) {
      this.loading = true
      try {
        const data = await fetchWithAuth('/api/tickets', {
          method: 'POST',
          body: JSON.stringify(ticket)
        })
        this.tickets.unshift(data)
        return data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateTicket(id, ticketData) {
      this.loading = true
      try {
        const response = await fetch(`${API_URL}/api/tickets/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.auth.token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(ticketData)
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to update ticket')
        }

        const index = this.tickets.findIndex(t => t.id === id)
        if (index !== -1) {
          this.tickets[index] = data
        }

        return data
      } catch (err) {
        console.error('Error updating ticket:', err)
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteTicket(id) {
      this.loading = true
      try {
        const response = await fetch(`${API_URL}/api/tickets/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.auth.token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Failed to delete ticket')
        }

        this.tickets = this.tickets.filter(t => t.id !== id)
      } catch (err) {
        console.error('Error deleting ticket:', err)
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    getTicketById: (state) => (id) => state.tickets.find(t => t.id === id)
  }
}) 