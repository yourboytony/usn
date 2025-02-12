import express from 'express'
import { 
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from '../controllers/announcementController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, getAnnouncements)
router.post('/', requireAdmin, createAnnouncement)
router.put('/:id', requireAdmin, updateAnnouncement)
router.delete('/:id', requireAdmin, deleteAnnouncement)

export default router 