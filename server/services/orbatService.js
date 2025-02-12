import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ORBAT_FILE = path.join(__dirname, '../data/orbat.json')

class OrbatService {
  async getOrbat() {
    const data = await fs.readFile(ORBAT_FILE, 'utf8')
    return JSON.parse(data)
  }

  async updateUnit(unitId, updates) {
    const orbat = await this.getOrbat()
    const unit = this.findUnit(orbat, unitId)
    
    if (!unit) {
      throw new Error('Unit not found')
    }

    Object.assign(unit, updates)
    await this.saveOrbat(orbat)
    return unit
  }

  async assignPersonnel(unitId, username) {
    const orbat = await this.getOrbat()
    const unit = this.findUnit(orbat, unitId)
    
    if (!unit) {
      throw new Error('Unit not found')
    }

    if (!unit.personnel.includes(username)) {
      unit.personnel.push(username)
      await this.saveOrbat(orbat)
    }
    
    return unit
  }

  async removePersonnel(unitId, username) {
    const orbat = await this.getOrbat()
    const unit = this.findUnit(orbat, unitId)
    
    if (!unit) {
      throw new Error('Unit not found')
    }

    unit.personnel = unit.personnel.filter(p => p !== username)
    await this.saveOrbat(orbat)
    return unit
  }

  findUnit(orbat, unitId, parent = null) {
    for (const branch of orbat.branches) {
      for (const unit of branch.units) {
        if (unit.id === unitId) return unit
        if (unit.subUnits) {
          for (const subUnit of unit.subUnits) {
            if (subUnit.id === unitId) return subUnit
          }
        }
      }
    }
    return null
  }

  async saveOrbat(orbat) {
    await fs.writeFile(ORBAT_FILE, JSON.stringify(orbat, null, 2))
  }

  async getRanks() {
    const orbat = await this.getOrbat()
    return orbat.ranks
  }

  async createUnit(unitData) {
    const orbat = await this.getOrbat()
    
    const newUnit = {
      id: Date.now().toString(),
      name: unitData.name,
      commander: unitData.commander,
      personnel: [],
      subUnits: []
    }

    orbat.branches[0].units.push(newUnit) // Add to Navy branch
    await this.saveOrbat(orbat)
    return newUnit
  }

  async createSubUnit(parentUnitId, subUnitData) {
    const orbat = await this.getOrbat()
    const parentUnit = this.findUnit(orbat, parentUnitId)

    if (!parentUnit) {
      throw new Error('Parent unit not found')
    }

    const newSubUnit = {
      id: Date.now().toString(),
      name: subUnitData.name,
      commander: subUnitData.commander,
      personnel: []
    }

    if (!parentUnit.subUnits) {
      parentUnit.subUnits = []
    }
    
    parentUnit.subUnits.push(newSubUnit)
    await this.saveOrbat(orbat)
    return newSubUnit
  }
}

export default new OrbatService() 