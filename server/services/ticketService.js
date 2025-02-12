import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TICKETS_FILE = path.join(__dirname, '../data/tickets.json')

// Ensure the data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(TICKETS_FILE)
  await fs.mkdir(dataDir, { recursive: true })
}

// Read tickets from file
async function readTickets() {
  try {
    await ensureDataDir()
    const data = await fs.readFile(TICKETS_FILE, 'utf8')
    return JSON.parse(data || '[]')
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist yet, return empty array
      return []
    }
    throw error
  }
}

// Write tickets to file
async function writeTickets(tickets) {
  await ensureDataDir()
  await fs.writeFile(TICKETS_FILE, JSON.stringify(tickets, null, 2))
}

// Get all tickets
async function getAllTickets() {
  return await readTickets()
}

// Get ticket by ID
async function getTicketById(id) {
  const tickets = await readTickets()
  return tickets.find(t => t.id === id)
}

// Create new ticket
async function createTicket(ticketData, user) {
  const tickets = await readTickets()
  const newTicket = {
    id: tickets.length > 0 ? Math.max(...tickets.map(t => t.id)) + 1 : 1,
    ...ticketData,
    status: 'OPEN',
    createdBy: {
      username: user.username,
      rank: user.rank,
      role: user.role
    },
    assignees: [],
    comments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  tickets.push(newTicket)
  await writeTickets(tickets)
  return newTicket
}

// Update ticket
async function updateTicket(id, updates, user) {
  const tickets = await readTickets()
  const index = tickets.findIndex(t => t.id === id)
  
  if (index === -1) {
    throw new Error('Ticket not found')
  }

  const ticket = tickets[index]

  // Handle assignee updates
  if (updates.addAssignee && !ticket.assignees.includes(updates.addAssignee)) {
    ticket.assignees.push(updates.addAssignee)
  }

  if (updates.removeAssignee) {
    ticket.assignees = ticket.assignees.filter(id => id !== updates.removeAssignee)
  }

  // Handle comment updates
  if (updates.comment) {
    ticket.comments.push({
      id: ticket.comments.length + 1,
      content: updates.comment,
      createdBy: {
        username: user.username,
        rank: user.rank,
        role: user.role
      },
      createdAt: new Date().toISOString()
    })
  }

  // Update other fields
  Object.assign(ticket, {
    ...ticket,
    ...updates,
    updatedAt: new Date().toISOString()
  })

  await writeTickets(tickets)
  return ticket
}

// Delete ticket
async function deleteTicket(id) {
  const tickets = await readTickets()
  const filteredTickets = tickets.filter(t => t.id !== id)
  
  if (filteredTickets.length === tickets.length) {
    throw new Error('Ticket not found')
  }
  
  await writeTickets(filteredTickets)
}

export default {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket
} 