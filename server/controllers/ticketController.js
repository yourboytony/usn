import ticketService from '../services/ticketService.js'

export async function getTickets(req, res) {
  try {
    const filters = {}
    if (req.query.creator) filters.creator = req.query.creator
    if (req.query.assignee) filters.assignee = req.query.assignee
    if (req.query.status) filters.status = req.query.status

    const tickets = await ticketService.getTickets(filters)
    res.json(tickets)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function createTicket(req, res) {
  try {
    const ticket = await ticketService.createTicket({
      ...req.body,
      creator: req.user.username
    })
    res.json(ticket)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function updateTicket(req, res) {
  try {
    const ticket = await ticketService.updateTicket(
      req.params.id,
      req.body
    )
    res.json(ticket)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function addComment(req, res) {
  try {
    const comment = await ticketService.addComment(
      req.params.id,
      {
        ...req.body,
        author: req.user.username
      }
    )
    res.json(comment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
} 