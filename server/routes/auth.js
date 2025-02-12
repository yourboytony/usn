import express from 'express'
import { login, logout, getCurrentUser, register } from '../controllers/authController.js'
import session from 'express-session'
import userService from '../services/userService.js'
import bcrypt from 'bcrypt'
import fs from 'fs'
import path from 'path'

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

// Login route
router.post('/login', login)

// Logout route
router.post('/logout', logout)

// Get current user
router.get('/me', getCurrentUser)

// Add this temporary debug route
router.get('/debug', async (req, res) => {
  try {
    console.log('\n=== Debug Route ===')
    const users = await userService.getAllUsers()
    console.log('All users:', users)
    
    // Test password hash
    const testPassword = 'password'
    const validPassword = await bcrypt.compare(
      testPassword, 
      '$2b$10$6jf7mz1YlE6NZX1YgPYs8.wLBZQ.VtS1glp4YCzGWnvGmHGwxngGq'
    )
    
    res.json({
      message: 'Debug info',
      userCount: users.length,
      testPasswordValid: validPassword,
      session: req.session,
      griffin: users.find(u => u.username === 'Griffin671992')
    })
  } catch (error) {
    console.error('Debug route error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Add this test route
router.get('/test-auth', async (req, res) => {
  try {
    const testPassword = 'password'
    const storedHash = '$2b$10$6jf7mz1YlE6NZX1YgPYs8.wLBZQ.VtS1glp4YCzGWnvGmHGwxngGq'
    
    console.log('\n=== Testing Password Hash ===')
    console.log('Test password:', testPassword)
    console.log('Stored hash:', storedHash)
    
    // Generate a new hash for comparison
    const newHash = await bcrypt.hash(testPassword, 10)
    console.log('New hash generated:', newHash)
    
    // Test both the stored hash and a new hash
    const validStored = await bcrypt.compare(testPassword, storedHash)
    const validNew = await bcrypt.compare(testPassword, newHash)
    
    console.log('Test results:', {
      storedHashWorks: validStored,
      newHashWorks: validNew
    })
    
    res.json({
      message: 'Auth test results',
      storedHashWorks: validStored,
      newHashWorks: validNew,
      storedHash,
      newHash
    })
  } catch (error) {
    console.error('Auth test error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Add this test route
router.get('/test-password', async (req, res) => {
  try {
    const testPassword = 'password'
    const storedHash = '$2b$10$6jf7mz1YlE6NZX1YgPYs8.wLBZQ.VtS1glp4YCzGWnvGmHGwxngGq'
    
    // Generate a new hash
    const newHash = await bcrypt.hash(testPassword, 10)
    
    // Test both hashes
    const validStored = await bcrypt.compare(testPassword, storedHash)
    const validNew = await bcrypt.compare(testPassword, newHash)
    
    res.json({
      message: 'Password test results',
      testPassword,
      storedHash,
      newHash,
      validStored,
      validNew
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Add this test route
router.get('/test-hash', async (req, res) => {
  try {
    // Get the stored user
    const user = await userService.getUserByUsername('Griffin671992')
    console.log('Found user:', {
      username: user.username,
      storedHash: user.password
    })

    // Test the password
    const testPassword = 'password'
    const isValid = await bcrypt.compare(testPassword, user.password)
    
    // Generate a new hash for comparison
    const newHash = await bcrypt.hash(testPassword, 10)
    const newIsValid = await bcrypt.compare(testPassword, newHash)

    res.json({
      message: 'Password test results',
      user: {
        username: user.username,
        storedHash: user.password
      },
      test: {
        password: testPassword,
        storedHashWorks: isValid,
        newHashWorks: newIsValid,
        newHash
      }
    })
  } catch (error) {
    console.error('Test hash error:', error)
    res.status(500).json({ error: error.message })
  }
})

// Add a route to reset the default user
router.post('/reset-default-user', async (req, res) => {
  try {
    const defaultUser = {
      id: 1,
      username: 'Griffin671992',
      password: await bcrypt.hash('password', 10),
      rank: 'CIC',
      role: 'Commander in Chief',
      permissions: ['ADMIN', 'COMMAND', 'ALL'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Read current users
    const users = await userService.getAllUsers()
    
    // Replace or add default user
    const index = users.findIndex(u => u.username === 'Griffin671992')
    if (index >= 0) {
      users[index] = defaultUser
    } else {
      users.push(defaultUser)
    }

    // Write back to file
    await fs.writeFile(
      path.join(__dirname, '../data/users.json'), 
      JSON.stringify(users, null, 2)
    )

    res.json({
      message: 'Default user reset',
      user: {
        ...defaultUser,
        password: '[REDACTED]'
      }
    })
  } catch (error) {
    console.error('Reset user error:', error)
    res.status(500).json({ error: error.message })
  }
})

router.post('/register', register)

export default router 