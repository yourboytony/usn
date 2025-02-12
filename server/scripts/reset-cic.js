import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const USERS_FILE = path.join(__dirname, '../data/users.json')

async function resetCICUser() {
  try {
    const password = 'Tonyplayz2023$'
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const cicUser = {
      id: 1,
      username: "Griffin671992",
      password: hashedPassword,
      rank: "CIC",
      role: "Commander in Chief",
      permissions: ["ADMIN", "COMMAND", "ALL"],
      commandAccess: true,
      isAdmin: true,
      avatarUrl: "https://api.dicebear.com/7.x/avatars/svg?seed=Griffin671992",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Ensure data directory exists
    const dataDir = path.join(__dirname, '../data')
    try {
      await fs.access(dataDir)
    } catch {
      await fs.mkdir(dataDir, { recursive: true })
    }

    // Write the users file
    await fs.writeFile(USERS_FILE, JSON.stringify([cicUser], null, 2))
    console.log('CIC user reset successfully')
  } catch (error) {
    console.error('Failed to reset CIC user:', error)
  }
}

resetCICUser() 