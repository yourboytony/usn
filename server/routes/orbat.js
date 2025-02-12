import express from 'express'
import { getOrbat, updateUnit, assignPersonnel, removePersonnel, createUnit, createSubUnit } from '../controllers/orbatController.js'

const router = express.Router()

router.get('/', getOrbat)
router.put('/units/:unitId', updateUnit)
router.post('/units/:unitId/personnel', assignPersonnel)
router.delete('/units/:unitId/personnel/:username', removePersonnel)
router.post('/units', createUnit)
router.post('/units/:unitId/subunits', createSubUnit)

export default router 