import express from 'express'
import jwt from 'jsonwebtoken'
import session from 'express-session'
import fetch from 'node-fetch'
import userService from './services/userService.js'

const router = express.Router()

// Session middleware configuration
export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
})

// Authentication middleware
export function authenticateSession(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  next()
}

// Add this near the top of the file with other declarations
export const pendingRequests = []

// Middleware to verify JWT token
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' })
    }
    req.user = user
    next()
  })
}

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }

    const user = await userService.authenticateUser(username, password)
    
    // Store user in session
    req.session.user = {
      id: user.id,
      username: user.username,
      rank: user.rank,
      role: user.role,
      permissions: user.permissions
    }

    res.json({ user })
  } catch (error) {
    console.error('Login error:', error)
    res.status(401).json({ message: error.message })
  }
})

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, password, rank, role } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }

    const user = await userService.createUser({ username, password, rank, role })
    res.status(201).json(user)
  } catch (error) {
    console.error('Registration error:', error)
    res.status(400).json({ message: error.message })
  }
})

// Get current user
router.get('/me', authenticateSession, (req, res) => {
  res.json({ user: req.session.user })
})

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Logout error:', err)
      return res.status(500).json({ message: 'Error during logout' })
    }
    res.json({ message: 'Logged out successfully' })
  })
})

// Update the division name formatting function
export function formatDivisionName(division) {
  const divisionNames = {
    // Major Commands
    opnav: "OPNAV (Office of the Chief of Naval Operations)",
    ffc: "Fleet Forces Command (FFC)",
    pacflt: "Pacific Fleet (PACFLT)",
    naveur: "Naval Forces Europe (NAVEUR)",
    navcent: "Naval Forces Central Command (NAVCENT)",

    // Type Commands
    surfor: "Surface Forces Command (SURFOR)",
    airfor: "Air Forces Command (AIRFOR)",
    subfor: "Submarine Forces (SUBFOR)",
    necc: "Navy Expeditionary Combat Command (NECC)",
    nswc: "Naval Special Warfare Command (NSWC)",

    // Education & Training
    netc: "Naval Education and Training Command (NETC)",
    nstc: "Naval Service Training Command (NSTC)",
    nawctsd: "Naval Air Warfare Center Training Systems Division",
    swsc: "Surface Warfare Schools Command (SWSC)",

    // Support Commands
    navsea: "Naval Sea Systems Command (NAVSEA)",
    navair: "Naval Air Systems Command (NAVAIR)",
    spawar: "Space and Naval Warfare Systems Command (SPAWAR)",
    navsup: "Naval Supply Systems Command (NAVSUP)",
    navfac: "Naval Facilities Engineering Command (NAVFAC)",

    // Intelligence & Security
    oni: "Office of Naval Intelligence (ONI)",
    ncis: "Naval Criminal Investigative Service (NCIS)",
    tenth_fleet: "Fleet Cyber Command (TENTH Fleet)",
    infosec: "Information Warfare Command",

    // Medical & Support Services
    bumed: "Bureau of Medicine and Surgery (BUMED)",
    jag: "Judge Advocate General's Corps (JAG)",
    chaplain: "Chaplain Corps",
    msc: "Military Sealift Command (MSC)",

    // Research & Development
    onr: "Office of Naval Research (ONR)",
    nrl: "Naval Research Laboratory (NRL)",
    nuwc: "Naval Undersea Warfare Center (NUWC)",
    nswc_labs: "Naval Surface Warfare Center Labs",

    // Reserve Components
    navresfor: "Navy Reserve Force (NAVRESFOR)",
    redcom: "Regional Reserve Commands (REDCOM)"
  }

  return divisionNames[division] || division.toUpperCase()
}

// Update the signup endpoint
router.post('/signup', async (req, res) => {
  const { username, discordTag, division, password } = req.body

  try {
    // Validate required fields
    if (!username || !discordTag || !division || !password) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      })
    }

    // Check if user already exists using userService
    const existingUser = await userService.getUserByUsername(username)
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Username already exists' 
      })
    }

    // Generate a unique request ID
    const requestId = Math.random().toString(36).substring(2, 15)

    // Send notification to Discord webhook
    const webhookResponse = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        embeds: [{
          title: "🔒 New Access Request",
          description: "A new user has requested access to the system.",
          color: 0x002E5D,
          fields: [
            {
              name: "ROBLOX Username",
              value: username,
              inline: true
            },
            {
              name: "Discord Tag",
              value: discordTag,
              inline: true
            },
            {
              name: "Requested Division",
              value: formatDivisionName(division),
              inline: true
            },
            {
              name: "Commands",
              value: "To approve: `/approve " + requestId + "`\nTo deny: `/deny " + requestId + "`",
              inline: false
            }
          ],
          footer: {
            text: `Request ID: ${requestId} • Pearl Harbor Naval Base`
          },
          timestamp: new Date().toISOString()
        }]
      })
    })

    if (!webhookResponse.ok) {
      console.error('Discord webhook error:', await webhookResponse.text())
      throw new Error('Failed to send Discord notification')
    }

    // Store pending request with ID
    pendingRequests.push({
      id: requestId,
      username,
      discordTag,
      division,
      password,
      requestDate: new Date(),
      status: 'pending',
      metadata: {
        ipAddress: req.ip,
        userAgent: req.headers['user-agent']
      }
    })

    // Log success
    console.log('New signup request stored:', {
      id: requestId,
      username,
      discordTag,
      division,
      requestDate: new Date()
    })

    res.json({ 
      message: 'Access request submitted successfully. Command staff will review your request.',
      requestId
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ 
      message: 'Failed to submit access request. Please try again later.' 
    })
  }
})

// Update the Discord interaction handler
router.post('/discord-interaction', async (req, res) => {
  const { type, data } = req.body

  if (type === 3) { // Button interaction
    const [action, requestId] = data.custom_id.split('_')
    const request = pendingRequests.find(r => r.id === requestId)

    if (!request) {
      return res.json({
        type: 4,
        data: {
          content: "Request not found. It may have expired or been processed already.",
          flags: 64 // Ephemeral (only visible to the user who clicked)
        }
      })
    }

    try {
      switch (action) {
        case 'approve':
          // Add user to the system using userService
          const newUser = await userService.createUser({
            username: request.username,
            password: request.password, // Will be hashed by userService
            rank: 'E-1', // Starting rank
            role: formatDivisionName(request.division)
          })
          
          // Update request status
          request.status = 'approved'
          
          // Send response
          return res.json({
            type: 4,
            data: {
              content: `✅ Access granted to ${newUser.username} for ${newUser.role}`,
              flags: 64
            }
          })

        case 'deny':
          // Update request status
          request.status = 'denied'
          
          return res.json({
            type: 4,
            data: {
              content: `❌ Access denied for ${request.username}`,
              flags: 64
            }
          })

        case 'info':
          return res.json({
            type: 4,
            data: {
              content: `Request Details:
Username: ${request.username}
Discord: ${request.discordTag}
Division: ${formatDivisionName(request.division)}
Requested: ${request.requestDate.toLocaleString()}
Status: ${request.status}`,
              flags: 64
            }
          })
      }
    } catch (error) {
      console.error('Error processing request:', error)
      return res.json({
        type: 4,
        data: {
          content: `Error processing request: ${error.message}`,
          flags: 64
        }
      })
    }
  }

  res.json({ type: 1 }) // Acknowledge the interaction
})

export default router 