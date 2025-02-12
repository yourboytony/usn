const API_URL = import.meta.env.VITE_API_URL

async function fetchWithProxy(url, options = {}) {
  // Try up to 3 times
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(`${API_URL}/api/proxy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        credentials: 'include',
        body: JSON.stringify({
          url,
          options: {
            ...options,
            headers: {
              ...options.headers,
              'User-Agent': 'Roblox/WinInet',
              'Accept': 'application/json'
            }
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error)
      if (attempt === 3) throw error
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
}

export const RobloxAPI = {
  async initialize() {
    console.log('Initializing Roblox API...')
    try {
      const groupId = import.meta.env.VITE_ROBLOX_GROUP_ID
      await this.fetchGroupInfo(groupId)
      console.log('Roblox API initialized successfully')
    } catch (error) {
      console.error('Failed to initialize:', error)
      throw error
    }
  },

  async fetchGroupInfo(groupId) {
    return fetchWithProxy(`https://groups.roblox.com/v1/groups/${groupId}`)
  },

  async fetchGroupRoles(groupId) {
    return fetchWithProxy(`https://groups.roblox.com/v1/groups/${groupId}/roles`)
  },

  async fetchGamePlayers(placeId) {
    return fetchWithProxy(`https://games.roblox.com/v1/games/multiget-place-details?placeIds=${placeId}`)
  }
} 