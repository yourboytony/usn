import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TRAINING_FILE = path.join(__dirname, '../data/training.json')

class TrainingService {
  async getTrainingData() {
    const data = await fs.readFile(TRAINING_FILE, 'utf8')
    return JSON.parse(data)
  }

  async saveTrainingData(data) {
    await fs.writeFile(TRAINING_FILE, JSON.stringify(data, null, 2))
  }

  async getCourses() {
    const data = await this.getTrainingData()
    return data.courses
  }

  async getSessions() {
    const data = await this.getTrainingData()
    return data.sessions
  }

  async getEnrollments() {
    const data = await this.getTrainingData()
    return data.enrollments
  }

  async createCourse(courseData) {
    const data = await this.getTrainingData()
    const newCourse = {
      id: `course-${Date.now()}`,
      ...courseData,
      sessions: [],
      status: 'active'
    }
    data.courses.push(newCourse)
    await this.saveTrainingData(data)
    return newCourse
  }

  async createSession(sessionData) {
    const data = await this.getTrainingData()
    const course = data.courses.find(c => c.id === sessionData.courseId)
    
    if (!course) {
      throw new Error('Course not found')
    }

    const newSession = {
      id: `session-${Date.now()}`,
      courseId: sessionData.courseId,
      courseName: course.name,
      startDate: sessionData.startDate,
      instructor: sessionData.instructor,
      maxParticipants: sessionData.maxParticipants || course.maxParticipants,
      participants: [],
      status: 'active',
      notes: sessionData.notes || '',
      completionStatus: {}
    }

    data.sessions.push(newSession)
    await this.saveTrainingData(data)
    return newSession
  }

  async enrollInCourse(username, courseId) {
    const data = await this.getTrainingData()
    const course = data.courses.find(c => c.id === courseId)
    
    if (!course) {
      throw new Error('Course not found')
    }

    // Check if already enrolled
    const existingEnrollment = data.enrollments.find(
      e => e.username === username && e.courseId === courseId
    )

    if (existingEnrollment) {
      throw new Error('Already enrolled in this course')
    }

    // Check prerequisites
    if (course.requirements.length > 0) {
      const completedCourses = data.enrollments
        .filter(e => e.username === username && e.progress === 'completed')
        .map(e => e.courseId)

      const missingPrereqs = course.requirements.filter(
        req => !completedCourses.includes(req)
      )

      if (missingPrereqs.length > 0) {
        throw new Error('Prerequisites not met')
      }
    }

    const newEnrollment = {
      id: `enrollment-${Date.now()}`,
      username,
      courseId,
      courseName: course.name,
      enrollmentDate: new Date().toISOString(),
      progress: 'in-progress',
      completionPercentage: 0
    }

    data.enrollments.push(newEnrollment)
    await this.saveTrainingData(data)
    return newEnrollment
  }

  async joinSession(username, sessionId) {
    const data = await this.getTrainingData()
    const session = data.sessions.find(s => s.id === sessionId)
    
    if (!session) {
      throw new Error('Session not found')
    }

    if (session.participants.includes(username)) {
      throw new Error('Already joined this session')
    }

    if (session.participants.length >= session.maxParticipants) {
      throw new Error('Session is full')
    }

    // Check if enrolled in course
    const enrollment = data.enrollments.find(
      e => e.username === username && e.courseId === session.courseId
    )

    if (!enrollment) {
      throw new Error('Must be enrolled in course to join session')
    }

    session.participants.push(username)
    await this.saveTrainingData(data)
    return session
  }

  async updateSessionProgress(sessionId, username, progress) {
    const data = await this.getTrainingData()
    const session = data.sessions.find(s => s.id === sessionId)
    
    if (!session) {
      throw new Error('Session not found')
    }

    if (!session.participants.includes(username)) {
      throw new Error('User not in session')
    }

    session.completionStatus[username] = progress
    
    // Update enrollment progress if session completed
    if (progress === 100) {
      const enrollment = data.enrollments.find(
        e => e.username === username && e.courseId === session.courseId
      )
      
      if (enrollment) {
        enrollment.completionPercentage = progress
        enrollment.progress = 'completed'
      }
    }

    await this.saveTrainingData(data)
    return session
  }

  async getCertifications(username) {
    const data = await this.getTrainingData()
    const completedCourses = data.enrollments
      .filter(e => e.username === username && e.progress === 'completed')
      .map(e => e.courseId)

    return data.certifications.filter(cert => 
      cert.requirements.every(req => completedCourses.includes(req))
    )
  }
}

export default new TrainingService() 