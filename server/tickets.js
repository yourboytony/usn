import express from 'express'
import { authenticateToken } from './auth.js'
import ticketService from './services/ticketService.js'

const router = express.Router()

// Get all tickets
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tickets = await ticketService.getAllTickets()
    
    // Filter tickets based on user's role/permissions
    const userTickets = tickets.filter(ticket => 
      ['CIC', 'CJCS', 'CNO'].includes(req.user.rank) || 
      ticket.createdBy.username === req.user.username
    )
    
    res.json(userTickets)
  } catch (error) {
    console.error('Error fetching tickets:', error)
    res.status(500).json({ message: 'Failed to fetch tickets' })
  }
})

// Create a ticket
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, department, priority } = req.body

    if (!title || !description || !department) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const ticket = await ticketService.createTicket({
      title,
      description,
      department,
      priority: priority || 'MEDIUM'
    }, req.user)

    res.status(201).json(ticket)
  } catch (error) {
    console.error('Error creating ticket:', error)
    res.status(500).json({ message: 'Failed to create ticket' })
  }
})

// Get a specific ticket
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(parseInt(req.params.id))
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' })
    }

    // Check if user has permission to view this ticket
    if (!['CIC', 'CJCS', 'CNO'].includes(req.user.rank) && 
        ticket.createdBy.username !== req.user.username) {
      return res.status(403).json({ message: 'Access denied' })
    }

    res.json(ticket)
  } catch (error) {
    console.error('Error fetching ticket:', error)
    res.status(500).json({ message: 'Failed to fetch ticket' })
  }
})

// Update a ticket
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(parseInt(req.params.id))
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' })
    }

    // Check if user has permission to update this ticket
    if (!['CIC', 'CJCS', 'CNO'].includes(req.user.rank) && 
        ticket.createdBy.username !== req.user.username) {
      return res.status(403).json({ message: 'Access denied' })
    }

    const updatedTicket = await ticketService.updateTicket(
      parseInt(req.params.id),
      req.body,
      req.user
    )

    res.json(updatedTicket)
  } catch (error) {
    console.error('Error updating ticket:', error)
    res.status(500).json({ message: 'Failed to update ticket' })
  }
})

// Delete a ticket
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const ticket = await ticketService.getTicketById(parseInt(req.params.id))
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' })
    }

    // Check if user has permission to delete this ticket
    if (!['CIC', 'CJCS', 'CNO'].includes(req.user.rank) && 
        ticket.createdBy.username !== req.user.username) {
      return res.status(403).json({ message: 'Access denied' })
    }

    await ticketService.deleteTicket(parseInt(req.params.id))
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting ticket:', error)
    res.status(500).json({ message: 'Failed to delete ticket' })
  }
})

// Add comment to a ticket
router.post('/:id/comments', authenticateToken, (req, res) => {
  try {
    const ticket = tickets.find(t => t.id === parseInt(req.params.id))
    
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' })
    }

    const { content } = req.body
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' })
    }

    const comment = {
      id: ticket.comments.length + 1,
      content,
      createdBy: {
        username: req.user.username,
        rank: req.user.rank,
        role: req.user.role
      },
      createdAt: new Date().toISOString()
    }

    ticket.comments.push(comment)
    ticket.updatedAt = new Date().toISOString()

    res.json(ticket)
  } catch (error) {
    console.error('Error adding comment:', error)
    res.status(500).json({ message: 'Failed to add comment' })
  }
})

export default router 