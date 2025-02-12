import { RANKS } from '../constants/ranks.js'

export function getRankLevel(rank) {
  // Special handling for CIC
  if (rank === 'CIC') return 28 // Higher than SECNAV
  
  for (const category in RANKS) {
    const found = RANKS[category].find(r => r.id === rank)
    if (found) return found.level
  }
  return 0
}

export function canPromoteTo(userRank, targetRank) {
  const userLevel = getRankLevel(userRank)
  const targetLevel = getRankLevel(targetRank)
  
  // CIC and HQ ranks can promote to any rank
  if (userRank === 'CIC' || userLevel >= getRankLevel('O-7')) {
    return true
  }
  
  // Command level (E-9) can promote up to E-8
  if (userLevel >= getRankLevel('E-9')) {
    return targetLevel <= getRankLevel('E-8')
  }
  
  return false
} 