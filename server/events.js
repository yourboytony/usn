import express from 'express'
import { authenticateToken, formatDivisionName } from './auth.js'

const router = express.Router()

// In-memory events store (replace with database in production)
const events = [
  {
    id: 1,
    title: 'Weekly Division Training',
    date: '2024-03-20T18:00:00',
    type: 'TRAINING',
    description: 'Standard division training and drills.',
    host: 'LT. Commander Smith',
    division: 'Surface Warfare',
    attendees: []
  },
  {
    id: 2,
    title: 'Fleet Inspection',
    date: '2024-03-22T14:00:00',
    type: 'INSPECTION',
    description: 'Quarterly fleet inspection and readiness assessment.',
    host: 'CAPT. Johnson',
    division: 'All Divisions',
    attendees: []
  }
]

// Get all events
router.get('/', authenticateToken, (req, res) => {
  try {
    // Filter events based on user's division if needed
    const userEvents = events.filter(event => 
      event.division === 'All Divisions' || 
      event.division === req.user.role
    )
    
    res.json(userEvents)
  } catch (error) {
    console.error('Error fetching events:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Attend an event
router.post('/:id/attend', authenticateToken, (req, res) => {
  const eventId = parseInt(req.params.id)
  const event = events.find(e => e.id === eventId)

  if (!event) {
    return res.status(404).json({ message: 'Event not found' })
  }

  // Check if user already attending
  if (event.attendees.some(a => a.username === req.user.username)) {
    return res.status(400).json({ message: 'Already attending this event' })
  }

  // Add user to attendees
  event.attendees.push({
    username: req.user.username,
    rank: req.user.rank,
    role: req.user.role
  })

  res.json(event)
})

// Create a new event
router.post('/', authenticateToken, (req, res) => {
  // Check if user has permission (staff/admin)
  if (!['CIC', 'CJCS', 'CNO'].includes(req.user.rank)) {
    return res.status(403).json({ message: 'Insufficient permissions' })
  }

  const { title, date, type, description, division, minRank } = req.body

  // Validate required fields
  if (!title || !date || !type || !description || !division) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  // Create new event
  const newEvent = {
    id: events.length + 1,
    title,
    date,
    type,
    description,
    host: `${req.user.rank} ${req.user.username}`,
    division: formatDivisionName(division),
    minRank,
    attendees: [],
    createdAt: new Date().toISOString(),
    createdBy: req.user.username
  }

  events.push(newEvent)
  res.status(201).json(newEvent)
})

// Update an event
router.put('/:id', authenticateToken, (req, res) => {
  const eventId = parseInt(req.params.id)
  const event = events.find(e => e.id === eventId)

  if (!event) {
    return res.status(404).json({ message: 'Event not found' })
  }

  // Check if user has permission
  if (!['CIC', 'CJCS', 'CNO'].includes(req.user.rank) && event.createdBy !== req.user.username) {
    return res.status(403).json({ message: 'Insufficient permissions' })
  }

  // Update fields
  Object.assign(event, {
    ...event,
    ...req.body,
    updatedAt: new Date().toISOString(),
    updatedBy: req.user.username
  })

  res.json(event)
})

// Delete an event
router.delete('/:id', authenticateToken, (req, res) => {
  const eventId = parseInt(req.params.id)
  const eventIndex = events.findIndex(e => e.id === eventId)

  if (eventIndex === -1) {
    return res.status(404).json({ message: 'Event not found' })
  }

  // Check if user has permission
  const event = events[eventIndex]
  if (!['CIC', 'CJCS', 'CNO'].includes(req.user.rank) && event.createdBy !== req.user.username) {
    return res.status(403).json({ message: 'Insufficient permissions' })
  }

  events.splice(eventIndex, 1)
  res.status(204).send()
})

// Get event attendees
router.get('/:id/attendees', authenticateToken, (req, res) => {
  const eventId = parseInt(req.params.id)
  const event = events.find(e => e.id === eventId)

  if (!event) {
    return res.status(404).json({ message: 'Event not found' })
  }

  res.json(event.attendees)
})

export default router 