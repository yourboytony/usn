import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const USERS_FILE = path.join(__dirname, '../data/users.json')

// Ensure the data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(__dirname, '../data')
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Helper function to read users file
async function readUsers() {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(USERS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If file doesn't exist, create it with default admin user
      const defaultUsers = [{
        id: 1,
        username: "Griffin671992",
        password: "$2b$10$6jf7mz1YlE6NZX1YgPYs8.wLBZQ.VtS1glp4YCzGWnvGmHGwxngGq", // password is "password"
        rank: "CIC",
        role: "Commander in Chief",
        permissions: ["ADMIN", "COMMAND", "ALL"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]
      await writeUsers(defaultUsers)
      return defaultUsers
    }
    console.error('Error reading users file:', error)
    throw new Error('Failed to read users data')
  }
}

// Helper function to write users file
async function writeUsers(users) {
  await ensureDataDirectory()
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2))
}

// Get all users
async function getAllUsers() {
  const users = await readUsers()
  return users.map(({ password, ...user }) => user) // Remove passwords from response
}

// Get user by ID
async function getUserById(id) {
  const users = await readUsers()
  const user = users.find(u => u.id === id)
  if (user) {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}

// Get user by username (including password for auth)
async function getUserByUsername(username) {
  const users = await readUsers()
  return users.find(u => u.username.toLowerCase() === username.toLowerCase())
}

// Create new user
async function createUser(userData) {
  const users = await readUsers()
  
  // Check if username already exists
  if (users.some(u => u.username.toLowerCase() === userData.username.toLowerCase())) {
    throw new Error('Username already exists')
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10)
  
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    username: userData.username,
    password: hashedPassword,
    rank: userData.rank || 'E-1',
    role: userData.role || 'Member',
    permissions: userData.permissions || ['MEMBER'],
    commandAccess: userData.commandAccess || false,
    isAdmin: userData.isAdmin || false,
    avatarUrl: `https://api.dicebear.com/7.x/avatars/svg?seed=${userData.username}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  // Add to users array
  users.push(newUser)
  
  // Write updated users to file
  await writeUsers(users)

  // Return user without password
  const { password, ...userWithoutPassword } = newUser
  return userWithoutPassword
}

// Update user
async function updateUser(id, updates) {
  const users = await readUsers()
  const index = users.findIndex(u => u.id === id)
  
  if (index === -1) {
    throw new Error('User not found')
  }

  const updatedUser = {
    ...users[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }

  users[index] = updatedUser
  await writeUsers(users)

  const { password, ...userWithoutPassword } = updatedUser
  return userWithoutPassword
}

// Delete user
async function deleteUser(id) {
  const users = await readUsers()
  const filteredUsers = users.filter(u => u.id !== id)
  
  if (filteredUsers.length === users.length) {
    throw new Error('User not found')
  }
  
  await writeUsers(filteredUsers)
}

// Add this test function
async function testPasswordHash(password, storedHash) {
  console.log('\n=== Testing Password Hash ===')
  console.log('Input:', {
    password,
    passwordLength: password.length,
    storedHash,
    storedHashLength: storedHash.length
  })

  const isValid = await bcrypt.compare(password, storedHash)
  console.log('Hash test result:', isValid)
  return isValid
}

// Update the authenticate function
async function authenticateUser(username, password) {
  console.log('\n=== Authentication Process ===')
  console.log('1. Looking up user:', username)
  
  const user = await getUserByUsername(username)
  
  if (!user) {
    console.log('❌ User not found')
    throw new Error('Invalid username or password')
  }

  console.log('2. User found:', {
    id: user.id,
    username: user.username,
    rank: user.rank,
    storedHash: user.password?.substring(0, 20) + '...'
  })

  if (!user.password) {
    console.log('❌ No password hash stored')
    throw new Error('Authentication failed - contact administrator')
  }

  try {
    console.log('3. Testing password...')
    const validPassword = await testPasswordHash(password, user.password)
    
    if (!validPassword) {
      console.log('❌ Password invalid')
      throw new Error('Invalid username or password')
    }

    console.log('✅ Authentication successful')
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error('❌ Authentication error:', {
      name: error.name,
      message: error.message
    })
    throw error
  }
}

// Add these functions to userService
async function getPendingRegistrationByUsername(username) {
  const pendingFile = path.join(__dirname, '../data/pending-registrations.json')
  try {
    const data = await fs.readFile(pendingFile, 'utf8')
    const registrations = JSON.parse(data)
    return registrations.find(r => r.username.toLowerCase() === username.toLowerCase())
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

async function createPendingRegistration(registration) {
  const pendingFile = path.join(__dirname, '../data/pending-registrations.json')
  let pendingRegistrations = []
  
  try {
    const data = await fs.readFile(pendingFile, 'utf8')
    pendingRegistrations = JSON.parse(data)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }

  const newRegistration = {
    ...registration,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  }

  pendingRegistrations.push(newRegistration)
  await fs.writeFile(pendingFile, JSON.stringify(pendingRegistrations, null, 2))
  
  return newRegistration
}

async function getPendingRegistration(id) {
  const pendingFile = path.join(__dirname, '../data/pending-registrations.json')
  try {
    const data = await fs.readFile(pendingFile, 'utf8')
    const registrations = JSON.parse(data)
    return registrations.find(r => r.id === id)
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
}

async function removePendingRegistration(id) {
  const pendingFile = path.join(__dirname, '../data/pending-registrations.json')
  try {
    const data = await fs.readFile(pendingFile, 'utf8')
    let registrations = JSON.parse(data)
    registrations = registrations.filter(r => r.id !== id)
    await fs.writeFile(pendingFile, JSON.stringify(registrations, null, 2))
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
}

const userService = {
  getAllUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser,
  authenticateUser,
  testPasswordHash,
  getPendingRegistrationByUsername,
  createPendingRegistration,
  getPendingRegistration,
  removePendingRegistration
}

export default userService 