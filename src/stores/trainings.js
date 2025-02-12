import { defineStore } from 'pinia'
import { fetchWithAuth } from '@/utils/api'

export const useTrainingStore = defineStore('trainings', {
  state: () => ({
    trainings: [],
    userProgress: {},
    loading: false,
    error: null
  }),

  actions: {
    async fetchTrainings() {
      this.loading = true
      try {
        const data = await fetchWithAuth('/api/trainings')
        this.trainings = data
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async createTraining(training) {
      this.loading = true
      try {
        const data = await fetchWithAuth('/api/trainings', {
          method: 'POST',
          body: JSON.stringify(training)
        })
        this.trainings.push(data)
        return data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateProgress(trainingId, status) {
      this.loading = true
      try {
        const data = await fetchWithAuth(`/api/trainings/${trainingId}/progress`, {
          method: 'POST',
          body: JSON.stringify({ status })
        })
        this.userProgress[trainingId] = data
        return data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  },

  getters: {
    getTrainingById: (state) => (id) => state.trainings.find(t => t.id === id),
    getProgressForTraining: (state) => (id) => state.userProgress[id]
  }
}) 