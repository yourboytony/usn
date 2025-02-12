import express from 'express'
import fetch from 'node-fetch'
import { authenticateToken } from './auth.js'

const router = express.Router()

// Proxy route for Roblox API requests
router.post('/', authenticateToken, async (req, res) => {
  const { url, options } = req.body

  try {
    // Add Roblox cookie and other required headers
    const headers = {
      ...options?.headers,
      'Cookie': `.ROBLOSECURITY=${process.env.ROBLOX_COOKIE}`,
      'User-Agent': 'Roblox/WinInet',
      'Accept': 'application/json'
    }

    console.log('Making Roblox API request:', {
      url,
      method: options?.method || 'GET',
      headers: { ...headers, Cookie: '[REDACTED]' }
    })

    const response = await fetch(url, {
      ...options,
      headers
    })

    // Get the response as text first
    const text = await response.text()
    
    // Try to parse as JSON, if not return as text
    try {
      const json = JSON.parse(text)
      res.json(json)
    } catch {
      res.send(text)
    }
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ 
      message: 'Proxy request failed',
      error: error.message 
    })
  }
})

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

export default router 