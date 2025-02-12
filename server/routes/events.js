import express from 'express'
import { 
  getEvents,
  createEvent,
  updateEvent,
  addAttendee,
  removeAttendee
} from '../controllers/eventController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, getEvents)
router.post('/', requireAuth, createEvent)
router.put('/:id', requireAuth, updateEvent)
router.post('/:id/attendees', requireAuth, addAttendee)
router.delete('/:id/attendees', requireAuth, removeAttendee)

export default router 