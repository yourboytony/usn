import trainingService from '../services/trainingService.js'

export async function getTrainingData(req, res) {
  try {
    const data = await trainingService.getTrainingData()
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function createCourse(req, res) {
  try {
    const course = await trainingService.createCourse(req.body)
    res.json(course)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function createSession(req, res) {
  try {
    const session = await trainingService.createSession(req.body)
    res.json(session)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function enrollInCourse(req, res) {
  try {
    const enrollment = await trainingService.enrollInCourse(
      req.user.username,
      req.params.courseId
    )
    res.json(enrollment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function joinSession(req, res) {
  try {
    const session = await trainingService.joinSession(
      req.user.username,
      req.params.sessionId
    )
    res.json(session)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function updateProgress(req, res) {
  try {
    const session = await trainingService.updateSessionProgress(
      req.params.sessionId,
      req.params.username,
      req.body.progress
    )
    res.json(session)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function getCertifications(req, res) {
  try {
    const certs = await trainingService.getCertifications(req.user.username)
    res.json(certs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
} 