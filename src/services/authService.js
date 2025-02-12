const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002'

class AuthService {
  async login(username, password) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed')
    }

    return data.user
  }

  async logout() {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    })
  }

  async getCurrentUser() {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      credentials: 'include'
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.user
  }

  async register(userData) {
    try {
      console.log('Attempting registration at:', API_URL)
      
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })

      // Log response status
      console.log('Registration response:', {
        status: response.status,
        ok: response.ok
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }
      return data
    } catch (error) {
      console.error('Registration error details:', {
        message: error.message,
        type: error.name,
        url: `${API_URL}/api/auth/register`
      })
      throw error
    }
  }
}

export default new AuthService() 