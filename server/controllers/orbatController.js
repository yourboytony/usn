import orbatService from '../services/orbatService.js'

export async function getOrbat(req, res) {
  try {
    const orbat = await orbatService.getOrbat()
    res.json(orbat)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function updateUnit(req, res) {
  try {
    const { unitId } = req.params
    const updates = req.body
    const unit = await orbatService.updateUnit(unitId, updates)
    res.json(unit)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function assignPersonnel(req, res) {
  try {
    const { unitId } = req.params
    const { username } = req.body
    const unit = await orbatService.assignPersonnel(unitId, username)
    res.json(unit)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function removePersonnel(req, res) {
  try {
    const { unitId, username } = req.params
    const unit = await orbatService.removePersonnel(unitId, username)
    res.json(unit)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function createUnit(req, res) {
  try {
    const unitData = req.body
    const unit = await orbatService.createUnit(unitData)
    res.json(unit)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function createSubUnit(req, res) {
  try {
    const { unitId } = req.params
    const subUnitData = req.body
    const subUnit = await orbatService.createSubUnit(unitId, subUnitData)
    res.json(subUnit)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
} 