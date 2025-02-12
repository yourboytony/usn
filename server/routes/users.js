import express from 'express'
import userService from '../services/userService.js'

const router = express.Router()

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await userService.getAllUsers()
    res.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ message: error.message })
  }
})

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body
    const updatedUser = await userService.updateUser(Number(id), updates)
    res.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ message: error.message })
  }
})

export default router 