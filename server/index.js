import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { sessionMiddleware } from './routes/auth.js'
import authRouter from './routes/auth.js'
import usersRouter from './routes/users.js'
import orbatRouter from './routes/orbat.js'
import trainingRouter from './routes/training.js'
import announcementsRouter from './routes/announcements.js'
import ticketsRouter from './routes/tickets.js'
import eventsRouter from './routes/events.js'
import userService from './services/userService.js'
import './services/discordService.js'
import client from './discord-bot.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002

// Function to find an available port
async function findAvailablePort(startPort) {
  const net = await import('net')
  
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.unref()
    
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${startPort} in use, trying ${startPort + 1}...`)
        server.listen(startPort + 1)
      } else {
        reject(err)
      }
    })

    server.listen(startPort, () => {
      const { port } = server.address()
      server.close(() => resolve(port))
    })
  })
}

// Add this after imports
async function runStartupTests() {
  try {
    console.log('\n=== Running Startup Tests ===')
    
    // Test password hashing
    const testResult = await userService.testPasswordHash(
      'password',
      '$2b$10$6jf7mz1YlE6NZX1YgPYs8.wLBZQ.VtS1glp4YCzGWnvGmHGwxngGq'
    )
    console.log('Password hash test:', testResult)
    
    // Test database access
    const users = await userService.getAllUsers()
    console.log('Database check:', {
      usersLoaded: users.length > 0,
      defaultUserExists: users.some(u => u.username === 'Griffin671992')
    })
    
    return true
  } catch (error) {
    console.error('Startup tests failed:', error)
    return false
  }
}

// At the top after imports
process.on('uncaughtException', (error) => {
  console.error('=== Uncaught Exception ===')
  console.error(error)
  process.exit(1)
})

// Start server with error handling
async function startServer() {
  try {
    console.log('\n=== Starting Server ===')
    console.log('Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      CLIENT_URL: process.env.CLIENT_URL
    })
    
    // Run startup tests first
    const testsOk = await runStartupTests()
    if (!testsOk) {
      throw new Error('Startup tests failed')
    }
    
    const port = await findAvailablePort(PORT)
    
    // Initialize Discord bot but don't block server start
    client.login(process.env.DISCORD_BOT_TOKEN)
      .then(() => console.log('✅ Discord bot connected'))
      .catch(error => {
        console.warn('⚠️ Discord bot failed to connect:', error.message)
        console.warn('Server will continue without Discord integration')
      })

    const server = app.listen(port, () => {
      console.log(`
=== Server Started Successfully ===
- Server running on port: ${port}
- API URL: http://localhost:${port}
- Client URL: ${process.env.CLIENT_URL || 'http://localhost:5175'}
- Environment: ${process.env.NODE_ENV || 'development'}

Test the server:
curl http://localhost:${port}/ping
      `)
    })

    server.on('error', (err) => {
      console.error('=== Server Error ===')
      console.error(err)
      process.exit(1)
    })

    return server
  } catch (err) {
    console.error('=== Failed to Start Server ===')
    console.error('Error:', err)
    console.error('Stack:', err.stack)
    process.exit(1)
  }
}

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\nGracefully shutting down...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\nGracefully shutting down...')
  process.exit(0)
})

// Basic logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`)
  next()
})

// Update CORS configuration to work with Cloudflare
const corsOptions = {
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5175',
    // Add your Cloudflare domain when you have it
    'https://your-domain.com',
    /\.your-domain\.com$/ // This will allow all subdomains
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))

// Add security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  next()
})

// Middleware
app.use(express.json())
app.use(sessionMiddleware)

// Test routes
app.get('/', (req, res) => {
  res.json({ message: 'Server running' })
})

app.get('/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint',
    time: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      PORT,
      CLIENT_URL: process.env.CLIENT_URL
    }
  })
})

// Add this before other routes
app.get('/ping', (req, res) => {
  res.json({ 
    status: 'ok',
    time: new Date().toISOString()
  })
})

// Main routes
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/orbat', orbatRouter)
app.use('/api/training', trainingRouter)
app.use('/api/announcements', announcementsRouter)
app.use('/api/tickets', ticketsRouter)
app.use('/api/events', eventsRouter)

// Add this after all routes are registered
app.get('/debug/routes', (req, res) => {
  const routes = []
  
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      // Routes registered directly on the app
      routes.push({
        path: middleware.route.path,
        method: Object.keys(middleware.route.methods)[0].toUpperCase()
      })
    } else if (middleware.name === 'router') {
      // Router middleware
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            method: Object.keys(handler.route.methods)[0].toUpperCase(),
            prefix: middleware.regexp.toString()
          })
        }
      })
    }
  })
  
  res.json({
    message: 'Registered routes',
    routes,
    middleware: app._router.stack.map(m => m.name || 'unnamed')
  })
})

// Add this at the very end of the file
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  // Application specific logging, throwing an error, or other logic here
})

// Start the server
startServer() 