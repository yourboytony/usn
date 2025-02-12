import { defineStore } from 'pinia'
import { fetchWithAuth } from '@/utils/api'
import router from '@/router'
import { API_BASE_URL } from '@/config/api'

// Helper to ensure consistent API URLs
const getApiUrl = (endpoint) => {
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
};

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    checkedAuth: false,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'ADMIN',
    isCiC: (state) => state.user?.rank === 'COMMANDER_IN_CHIEF',
    hasFullAccess: (state) => state.user?.role === 'ADMIN' && state.user?.rank === 'COMMANDER_IN_CHIEF',
    hasCommandAccess: (state) => state.user?.permissions?.includes('COMMAND') || false
  },

  actions: {
    async login(username, password) {
      console.log('Auth store: Starting login')
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(getApiUrl('/api/auth/login'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        })

        console.log('Auth store: Response status:', response.status)

        if (response.status === 405) {
          throw new Error('API endpoint not configured correctly')
        }

        const data = await response.json()
        console.log('Auth store: Response data:', data)

        if (!response.ok) {
          throw new Error(data.error || 'Login failed')
        }

        this.token = data.token
        this.user = data.user
        localStorage.setItem('token', data.token)
        
        return true
      } catch (error) {
        console.error('Auth store: Login error:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async signup(username, password, discordUsername) {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password, discordUsername })
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        return true
      } catch (error) {
        this.error = error.message
        return false
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      router.push('/login')
    },

    async checkAuth() {
      if (!this.token) {
        this.token = localStorage.getItem('token')
      }

      if (this.token) {
        try {
          const response = await fetchWithAuth('/api/auth/me')
          this.user = response
          this.checkedAuth = true
          return true
        } catch (error) {
          console.error('Auth store: CheckAuth error:', error) // Debug log
          this.logout()
          return false
        }
      }

      this.checkedAuth = true
      return false
    },

    async register(userData) {
      this.loading = true
      this.error = null

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error)
        return data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 