import { defineStore } from 'pinia'
import { ref } from 'vue'

const API_URL = import.meta.env.VITE_API_URL

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false,
    error: null
  }),

  getters: {
    getUserById: (state) => (id) => state.users.find(u => u.id === id),
  },

  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch(`${API_URL}/api/users`, {
          credentials: 'include'
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Failed to fetch users')
        }
        
        const data = await response.json()
        this.users = data
      } catch (error) {
        console.error('Error fetching users:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUser(id, updates) {
      this.loading = true
      this.error = null
      try {
        const response = await fetch(`${API_URL}/api/users/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(updates)
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Failed to update user')
        }

        const updatedUser = await response.json()
        const index = this.users.findIndex(u => u.id === id)
        if (index !== -1) {
          this.users[index] = updatedUser
        }
        return updatedUser
      } catch (error) {
        console.error('Error updating user:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 