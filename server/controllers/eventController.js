import eventService from '../services/eventService.js'

export async function getEvents(req, res) {
  try {
    const filters = {}
    if (req.query.organizer) filters.organizer = req.query.organizer
    if (req.query.attendee) filters.attendee = req.query.attendee
    if (req.query.type) filters.type = req.query.type

    const events = await eventService.getEvents(filters)
    res.json(events)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function createEvent(req, res) {
  try {
    const event = await eventService.createEvent({
      ...req.body,
      organizer: req.user.username
    })
    res.json(event)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function updateEvent(req, res) {
  try {
    const event = await eventService.updateEvent(
      req.params.id,
      req.body
    )
    res.json(event)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function addAttendee(req, res) {
  try {
    const event = await eventService.addAttendee(
      req.params.id,
      req.user.username
    )
    res.json(event)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function removeAttendee(req, res) {
  try {
    const event = await eventService.removeAttendee(
      req.params.id,
      req.user.username
    )
    res.json(event)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
} 