import { defineStore } from 'pinia'
import { ref } from 'vue'
import { RobloxAPI } from '@/utils/roblox'
import { useAuthStore } from './auth'

export const useRobloxStore = defineStore('roblox', () => {
  const groupInfo = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const presenceSyncInterval = ref(null)
  const activePlayers = ref(0)
  const auth = useAuthStore()

  async function initialize() {
    if (!auth.isAuthenticated) {
      console.log('User not authenticated, skipping Roblox initialization')
      return
    }

    loading.value = true
    error.value = null

    try {
      await RobloxAPI.initialize()
    } catch (err) {
      console.error('Failed to initialize Roblox API:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  function startPresenceSync() {
    if (!auth.isAuthenticated) {
      console.log('User not authenticated, skipping presence sync')
      return
    }

    console.log('Starting presence sync...')
    stopPresenceSync() // Clear any existing interval

    presenceSyncInterval.value = setInterval(async () => {
      try {
        const placeId = import.meta.env.VITE_ROBLOX_PLACE_ID
        const data = await RobloxAPI.fetchGamePlayers(placeId)
        activePlayers.value = data[0]?.playing || 0
      } catch (error) {
        console.error('Failed to fetch game players:', error)
      }
    }, 30000) // Every 30 seconds
  }

  function stopPresenceSync() {
    if (presenceSyncInterval.value) {
      clearInterval(presenceSyncInterval.value)
      presenceSyncInterval.value = null
    }
  }

  return {
    groupInfo,
    loading,
    error,
    activePlayers,
    initialize,
    startPresenceSync,
    stopPresenceSync
  }
}) 