const ROBLOX_API = {
  GAMES: 'https://games.roblox.com/v1',
  GROUPS: 'https://groups.roblox.com/v1',
  USERS: 'https://users.roblox.com/v1',
  THUMBNAILS: 'https://thumbnails.roblox.com/v1',
  PRESENCE: 'https://presence.roblox.com/v1'
}

export const NAVAL_ACADEMY_PLACE_ID = 13883527703

// Helper function to handle CORS with proxy
async function fetchWithProxy(url, options = {}) {
  const cookie = import.meta.env.VITE_ROBLOX_COOKIE
  
  // Validate cookie format
  if (!cookie.startsWith('_|WARNING:-DO-NOT-SHARE-THIS')) {
    console.error('Invalid cookie format')
    throw new Error('Invalid cookie format')
  }

  console.log('Cookie format check passed')
  console.log('Cookie starts with:', cookie.substring(0, 50) + '...')

  const headers = {
    'Content-Type': 'application/json',
    'Cookie': `.ROBLOSECURITY=${cookie}`,
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Referer': 'https://www.roblox.com/',
    'Origin': 'https://www.roblox.com',
    ...options.headers
  }

  const MAX_RETRIES = 3
  let attempt = 0

  while (attempt < MAX_RETRIES) {
    try {
      if (attempt > 0) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 10000)
        await new Promise(resolve => setTimeout(resolve, delay))
      }

      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url,
          method: options.method || 'GET',
          headers,
          body: options.body
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      // Check for authentication errors
      if (data.errors && data.errors.some(e => e.message === 'Unauthorized')) {
        console.error('Authentication failed. Please check your Roblox cookie.')
        throw new Error('Authentication failed')
      }

      return data

    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error)
      attempt++
      
      if (attempt < MAX_RETRIES) {
        continue
      }
      
      throw error
    }
  }
}

// Fetch group info
export async function fetchGroupInfo(groupId) {
  return fetchWithProxy(`${ROBLOX_API.GROUPS}/groups/${groupId}`)
}

// Fetch group members with pagination
export async function fetchGroupMembers(groupId, cursor = '') {
  const limit = 100
  const url = `${ROBLOX_API.GROUPS}/groups/${groupId}/users?limit=${limit}&sortOrder=Asc${cursor ? `&cursor=${cursor}` : ''}`
  const response = await fetchWithProxy(url)
  return response
}

// Fetch all members
export async function fetchAllMembers(groupId) {
  let allMembers = []
  let nextCursor = ''
  let totalMembers = 0

  do {
    const response = await fetchGroupMembers(groupId, nextCursor)
    totalMembers = response.total
    allMembers = [...allMembers, ...response.data]
    nextCursor = response.nextPageCursor
    console.log(`Fetched batch of ${response.data.length} members. Next cursor: ${nextCursor}`)
  } while (nextCursor)

  console.log(`Fetched all members: ${allMembers.length}/${totalMembers}`)
  return allMembers
}

// Fetch user thumbnail
export async function fetchUserThumbnail(userId) {
  if (!userId) {
    console.warn('Attempted to fetch thumbnail for undefined userId')
    return null
  }

  const url = `${ROBLOX_API.THUMBNAILS}/users/avatar-headshot?userIds=${userId}&size=150x150&format=png`
  const response = await fetchWithProxy(url)
  return response.data[0]?.imageUrl
}

// Fetch game players
export async function fetchGamePlayers() {
  try {
    const url = `${ROBLOX_API.GAMES}/games/multiget-place-details?placeIds=${NAVAL_ACADEMY_PLACE_ID}`
    console.log('Fetching game players from:', url)

    const response = await fetchWithProxy(url)
    console.log('Raw game players response:', response)

    // Check for errors in response with more detailed logging
    if (response.errors) {
      console.error('API returned errors:', JSON.stringify(response.errors, null, 2))
      // Log the full error object
      response.errors.forEach((error, index) => {
        console.error(`Error ${index + 1}:`, {
          code: error.code,
          message: error.message,
          field: error.field
        })
      })
      return 0
    }

    let players = 0

    if (Array.isArray(response)) {
      players = response[0]?.currentPlayers || 0
    } else if (Array.isArray(response?.data)) {
      players = response.data[0]?.currentPlayers || 0
    }

    console.log('Parsed player count:', players)
    return players

  } catch (error) {
    console.error('Failed to fetch game players:', error)
    return 0
  }
}

// Fetch server details
export async function fetchServerDetails(serverId) {
  const response = await fetchWithProxy(
    `${ROBLOX_API.GAMES}/games/${NAVAL_ACADEMY_PLACE_ID}/servers/${serverId}`
  )
  return response
}

// Fetch game info
export async function fetchGameInfo() {
  return fetchWithProxy(
    `${ROBLOX_API.GAMES}/games/multiget-place-details?placeIds=${NAVAL_ACADEMY_PLACE_ID}`
  )
}

export async function fetchUserRank(groupId, userId) {
  const response = await fetch(`${ROBLOX_API.GROUPS}/users/${userId}/groups/roles`)
  if (!response.ok) throw new Error('Failed to fetch user rank')
  const groups = await response.json()
  return groups.find(g => g.group.id === groupId)?.role
}

export async function verifyGroupMembership(groupId, userId) {
  try {
    const rank = await fetchUserRank(groupId, userId)
    return !!rank
  } catch (error) {
    console.error('Failed to verify group membership:', error)
    return false
  }
}

export async function fetchGroupRoles(groupId) {
  const response = await fetch(`${ROBLOX_API.GROUPS}/groups/${groupId}/roles`)
  if (!response.ok) throw new Error('Failed to fetch group roles')
  return response.json()
}

export async function fetchGroupAuditLog(groupId) {
  const response = await fetch(`${ROBLOX_API.GROUPS}/groups/${groupId}/audit-log`)
  if (!response.ok) throw new Error('Failed to fetch audit log')
  return response.json()
}

export async function fetchGroupAnalytics(groupId) {
  // This would be your backend API endpoint that aggregates Roblox data
  const response = await fetch(`/api/roblox/analytics/${groupId}`)
  if (!response.ok) throw new Error('Failed to fetch analytics')
  return response.json()
}

export async function fetchOnlineMembers(userIds) {
  if (!userIds?.length) {
    console.warn('No userIds provided to fetchOnlineMembers')
    return []
  }

  try {
    const response = await fetchWithProxy(
      `${ROBLOX_API.PRESENCE}/v1/presence/users`,
      {
        method: 'POST',
        body: JSON.stringify({
          userIds: userIds.filter(Boolean)
        })
      }
    )

    if (!response?.userPresences) {
      console.error('Invalid presence response:', response)
      return []
    }

    // Add inNavalAcademy flag and return
    return response.userPresences.map(presence => ({
      ...presence,
      inNavalAcademy: presence.placeId === NAVAL_ACADEMY_PLACE_ID
    }))

  } catch (error) {
    console.error('Failed to fetch online status:', error)
    return []
  }
}

export async function fetchGroupMemberIds(groupId) {
  const members = await fetchAllMembers(groupId)
  return members.map(member => member.userId)
}

export async function fetchMemberPresence(userId) {
  const response = await fetch(`${ROBLOX_API.USERS}/users/${userId}/presence`)
  if (!response.ok) throw new Error('Failed to fetch member presence')
  return response.json()
}

export async function fetchMemberDetails(userId) {
  const response = await fetch(`https://users.roblox.com/v1/users/${userId}`)
  if (!response.ok) throw new Error('Failed to fetch member details')
  return response.json()
}

export async function fetchMembers(groupId, cursor = '') {
  try {
    const response = await fetchWithProxy(
      `${ROBLOX_API.GROUPS}/groups/${groupId}/users?limit=100&cursor=${cursor}`
    )
    
    if (!response?.data) {
      console.error('Invalid response format:', response)
      return { members: [], nextPageCursor: null }
    }

    console.log('Raw members fetched:', response.data.length)

    // Process members in batches of 10 for better performance
    const members = []
    for (const member of response.data) {
      // Validate member data
      if (!member?.user?.id) {
        console.warn('Skipping invalid member data:', member)
        continue
      }

      try {
        // Create member object with required data
        const processedMember = {
          userId: member.user.id,
          username: member.user.username,
          displayName: member.user.displayName,
          rank: member.role?.rank || 0,
          role: member.role?.name || 'Member'
        }

        // Fetch thumbnail
        processedMember.thumbnail = await fetchUserThumbnail(processedMember.userId)
        
        // Add to members array
        members.push(processedMember)

        // Log progress
        if (members.length % 10 === 0) {
          console.log(`Processed ${members.length}/${response.data.length} members`)
        }
      } catch (error) {
        console.error(`Failed to process member ${member.user?.id}:`, error)
      }
    }

    console.log('All members processed:', members.length)
    
    return {
      members,
      nextPageCursor: response.nextPageCursor
    }
  } catch (error) {
    console.error('Error fetching members:', error)
    return { members: [], nextPageCursor: null }
  }
} 