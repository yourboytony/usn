import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ANNOUNCEMENTS_FILE = path.join(__dirname, '../data/announcements.json')

class AnnouncementService {
  async getAnnouncements() {
    const data = await fs.readFile(ANNOUNCEMENTS_FILE, 'utf8')
    return JSON.parse(data).announcements
  }

  async createAnnouncement(announcementData) {
    const data = JSON.parse(await fs.readFile(ANNOUNCEMENTS_FILE, 'utf8'))
    
    const newAnnouncement = {
      id: `ann-${Date.now()}`,
      ...announcementData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    data.announcements.push(newAnnouncement)
    await fs.writeFile(ANNOUNCEMENTS_FILE, JSON.stringify(data, null, 2))
    return newAnnouncement
  }

  async updateAnnouncement(id, updates) {
    const data = JSON.parse(await fs.readFile(ANNOUNCEMENTS_FILE, 'utf8'))
    const announcement = data.announcements.find(a => a.id === id)
    
    if (!announcement) {
      throw new Error('Announcement not found')
    }

    Object.assign(announcement, updates, {
      updatedAt: new Date().toISOString()
    })

    await fs.writeFile(ANNOUNCEMENTS_FILE, JSON.stringify(data, null, 2))
    return announcement
  }

  async deleteAnnouncement(id) {
    const data = JSON.parse(await fs.readFile(ANNOUNCEMENTS_FILE, 'utf8'))
    data.announcements = data.announcements.filter(a => a.id !== id)
    await fs.writeFile(ANNOUNCEMENTS_FILE, JSON.stringify(data, null, 2))
  }
}

export default new AnnouncementService() 