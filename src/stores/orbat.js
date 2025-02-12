import { defineStore } from 'pinia'
import { fetchWithAuth } from '@/utils/api'

export const useOrbatStore = defineStore('orbat', {
  state: () => ({
    structure: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchStructure() {
      this.loading = true
      try {
        const data = await fetchWithAuth('/api/orbat')
        this.structure = data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async createUnit(unit) {
      this.loading = true
      try {
        const data = await fetchWithAuth('/api/orbat', {
          method: 'POST',
          body: JSON.stringify(unit)
        })
        await this.fetchStructure() // Refetch to get updated structure
        return data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUnit(id, updates) {
      this.loading = true
      try {
        const data = await fetchWithAuth(`/api/orbat/${id}`, {
          method: 'PUT',
          body: JSON.stringify(updates)
        })
        await this.fetchStructure() // Refetch to get updated structure
        return data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteUnit(id) {
      this.loading = true
      try {
        await fetchWithAuth(`/api/orbat/${id}`, {
          method: 'DELETE'
        })
        await this.fetchStructure() // Refetch to get updated structure
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    getUnitById: (state) => (id) => state.structure.find(u => u.id === id),
    getChildUnits: (state) => (parentId) => 
      state.structure.filter(u => u.parent_id === parentId)
  }
}) 