import announcementService from '../services/announcementService.js'

export async function getAnnouncements(req, res) {
  try {
    const announcements = await announcementService.getAnnouncements()
    res.json(announcements)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function createAnnouncement(req, res) {
  try {
    const announcement = await announcementService.createAnnouncement({
      ...req.body,
      author: req.user.username
    })
    res.json(announcement)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function updateAnnouncement(req, res) {
  try {
    const announcement = await announcementService.updateAnnouncement(
      req.params.id,
      req.body
    )
    res.json(announcement)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function deleteAnnouncement(req, res) {
  try {
    await announcementService.deleteAnnouncement(req.params.id)
    res.json({ message: 'Announcement deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
} 