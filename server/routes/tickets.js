import express from 'express'
import { 
  getTickets,
  createTicket,
  updateTicket,
  addComment
} from '../controllers/ticketController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, getTickets)
router.post('/', requireAuth, createTicket)
router.put('/:id', requireAuth, updateTicket)
router.post('/:id/comments', requireAuth, addComment)

export default router 