import express from 'express'
import { 
  getTrainingData,
  createCourse,
  createSession,
  enrollInCourse,
  joinSession,
  updateProgress,
  getCertifications
} from '../controllers/trainingController.js'
import { requireAuth, requireAdmin, requireInstructor } from '../middleware/auth.js'

const router = express.Router()

// Public routes
router.get('/', requireAuth, getTrainingData)
router.get('/certifications', requireAuth, getCertifications)

// Student routes
router.post('/courses/:courseId/enroll', requireAuth, enrollInCourse)
router.post('/sessions/:sessionId/join', requireAuth, joinSession)

// Instructor routes
router.post('/sessions', requireInstructor, createSession)
router.put('/sessions/:sessionId/progress/:username', requireInstructor, updateProgress)

// Admin routes
router.post('/courses', requireAdmin, createCourse)

export default router 