import { defineStore } from 'pinia'
import { fetchWithAuth } from '@/utils/api'

export const useReportStore = defineStore('reports', {
  state: () => ({
    reports: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchReports() {
      this.loading = true
      try {
        const data = await fetchWithAuth('/api/reports')
        this.reports = data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async createReport(formData) {
      this.loading = true
      try {
        const data = await fetchWithAuth('/api/reports', {
          method: 'POST',
          body: formData,
          // Don't set Content-Type header, let browser set it with boundary for FormData
          headers: {}
        })
        this.reports.unshift(data)
        return data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateReport(id, formData) {
      this.loading = true
      try {
        const data = await fetchWithAuth(`/api/reports/${id}`, {
          method: 'PUT',
          body: formData,
          headers: {}
        })
        const index = this.reports.findIndex(r => r.id === id)
        if (index !== -1) {
          this.reports[index] = data
        }
        return data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteReport(id) {
      this.loading = true
      try {
        await fetchWithAuth(`/api/reports/${id}`, {
          method: 'DELETE'
        })
        this.reports = this.reports.filter(r => r.id !== id)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 