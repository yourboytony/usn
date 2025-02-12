import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { compareRanks } from '@/constants/ranks'
import { fetchWithAuth } from '@/utils/api'

export const useAnnouncementStore = defineStore('announcements', {
  state: () => ({
    announcements: [],
    loading: false,
    error: null
  }),

  getters: {
    visibleAnnouncements: (state) => {
      const authStore = useAuthStore()
      const currentUser = authStore.user

      return state.announcements.filter(announcement => {
        // All members can see announcements with 'all' visibility
        if (announcement.visibility === 'all') return true

        // Filter by department
        if (announcement.visibility === 'department') {
          return announcement.selectedDepartments.some(
            deptId => currentUser.departments.includes(deptId)
          )
        }

        // Filter by minimum rank
        if (announcement.visibility === 'rank') {
          return compareRanks(currentUser.rank, announcement.minRank) >= 0
        }

        return false
      })
    }
  },

  actions: {
    async fetchAnnouncements() {
      this.loading = true
      try {
        const data = await fetchWithAuth('/api/announcements')
        this.announcements = data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async createAnnouncement(announcement) {
      this.loading = true
      try {
        const data = await fetchWithAuth('/api/announcements', {
          method: 'POST',
          body: JSON.stringify(announcement)
        })
        this.announcements.unshift(data)
        return data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteAnnouncement(id) {
      try {
        const response = await fetch(`/api/announcements/${id}`, {
          method: 'DELETE'
        })

        if (!response.ok) throw new Error('Failed to delete announcement')
        
        this.announcements = this.announcements.filter(a => a.id !== id)
      } catch (error) {
        this.error = error.message
        throw error
      }
    }
  }
}) 