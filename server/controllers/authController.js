import bcrypt from 'bcrypt'
import userService from '../services/userService.js'
import { sendVerificationMessage } from '../services/discordService.js'

export async function login(req, res) {
  try {
    const { username, password } = req.body

    console.log('\n=== Login Attempt ===')
    console.log('Username:', username)
    console.log('Has Password:', !!password)

    if (!username || !password) {
      console.log('❌ Missing credentials')
      return res.status(400).json({ 
        message: 'Username and password are required' 
      })
    }

    const user = await userService.getUserByUsername(username)
    console.log('User found:', {
      exists: !!user,
      username: user?.username,
      hashedPassword: user?.password?.substring(0, 20) + '...',
      rank: user?.rank
    })

    if (!user) {
      console.log('❌ User not found')
      return res.status(401).json({ 
        message: 'Invalid username or password' 
      })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    console.log('Password check:', {
      isValid: validPassword,
      inputLength: password.length,
      storedHashLength: user.password.length
    })

    if (!validPassword) {
      console.log('❌ Invalid password')
      return res.status(401).json({ 
        message: 'Invalid username or password' 
      })
    }

    // Create session
    const sessionUser = {
      id: user.id,
      username: user.username,
      rank: user.rank,
      role: user.role,
      permissions: user.permissions
    }

    req.session.user = sessionUser
    console.log('✅ Login successful:', {
      username: sessionUser.username,
      rank: sessionUser.rank,
      sessionId: req.session.id
    })

    res.json({
      user: sessionUser,
      message: 'Login successful'
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      message: 'Internal server error' 
    })
  }
}

export async function logout(req, res) {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ 
        message: 'Error during logout' 
      })
    }
    res.json({ message: 'Logged out successfully' })
  })
}

export async function getCurrentUser(req, res) {
  if (!req.session.user) {
    return res.status(401).json({ 
      message: 'Not authenticated' 
    })
  }
  res.json({ user: req.session.user })
}

export async function register(req, res) {
  try {
    const { username, password, discordUsername } = req.body

    if (!username || !password || !discordUsername) {
      return res.status(400).json({
        message: 'All fields are required'
      })
    }

    // Check if username exists
    const existingUser = await userService.getUserByUsername(username)
    if (existingUser) {
      return res.status(400).json({
        message: 'Username already exists'
      })
    }

    // Create pending registration
    const pendingUser = {
      username,
      password: await bcrypt.hash(password, 10),
      discordUsername,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    const registration = await userService.createPendingRegistration(pendingUser)

    // Try to send Discord message, but don't fail if it doesn't work
    try {
      await sendVerificationMessage({
        username,
        discordUsername,
        registrationId: registration.id
      })
    } catch (error) {
      console.warn('Failed to send Discord verification:', error.message)
    }

    res.json({
      message: 'Registration request sent for approval',
      status: 'pending'
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ 
      message: 'Registration failed' 
    })
  }
} 