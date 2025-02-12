export const RANKS = {
  ENLISTED: [
    { id: 'E-1', abbr: 'SR', name: 'Seaman Recruit', level: 1 },
    { id: 'E-2', abbr: 'SA', name: 'Seaman Apprentice', level: 2 },
    { id: 'E-3', abbr: 'SN', name: 'Seaman', level: 3 },
    { id: 'E-4', abbr: 'PO3', name: 'Petty Officer Third Class', level: 4 },
    { id: 'E-5', abbr: 'PO2', name: 'Petty Officer Second Class', level: 5 },
    { id: 'E-6', abbr: 'PO1', name: 'Petty Officer First Class', level: 6 },
    { id: 'E-7', abbr: 'CPO', name: 'Chief Petty Officer', level: 7 },
    { id: 'E-8', abbr: 'SCPO', name: 'Senior Chief Petty Officer', level: 8 },
    { id: 'E-9', abbr: 'MCPO', name: 'Master Chief Petty Officer', level: 9 }
  ],
  WARRANT: [
    { id: 'W-1', abbr: 'WO1', name: 'Warrant Officer 1', level: 10 },
    { id: 'W-2', abbr: 'CWO2', name: 'Chief Warrant Officer 2', level: 11 },
    { id: 'W-3', abbr: 'CWO3', name: 'Chief Warrant Officer 3', level: 12 },
    { id: 'W-4', abbr: 'CWO4', name: 'Chief Warrant Officer 4', level: 13 },
    { id: 'W-5', abbr: 'CWO5', name: 'Chief Warrant Officer 5', level: 14 }
  ],
  OFFICER: [
    { id: 'O-1', abbr: 'ENS', name: 'Ensign', level: 15 },
    { id: 'O-2', abbr: 'LTJG', name: 'Lieutenant Junior Grade', level: 16 },
    { id: 'O-3', abbr: 'LT', name: 'Lieutenant', level: 17 },
    { id: 'O-4', abbr: 'LCDR', name: 'Lieutenant Commander', level: 18 },
    { id: 'O-5', abbr: 'CDR', name: 'Commander', level: 19 },
    { id: 'O-6', abbr: 'CAPT', name: 'Captain', level: 20 }
  ],
  FLAG: [
    { id: 'O-7', abbr: 'RDML', name: 'Rear Admiral Lower Half', level: 21 },
    { id: 'O-8', abbr: 'RADM', name: 'Rear Admiral Upper Half', level: 22 },
    { id: 'O-9', abbr: 'VADM', name: 'Vice Admiral', level: 23 },
    { id: 'O-10', abbr: 'ADM', name: 'Admiral', level: 24 }
  ],
  SPECIAL: [
    { id: 'FADM', abbr: 'FADM', name: 'Fleet Admiral', level: 25 },
    { id: 'CNO', abbr: 'CNO', name: 'Chief of Naval Operations', level: 26 },
    { id: 'SECNAV', abbr: 'SECNAV', name: 'Secretary of the Navy', level: 27 },
    { id: 'CIC', abbr: 'CIC', name: 'Commander in Chief', level: 28 }
  ]
}

export const COMMANDS = [
  {
    id: 'pacflt',
    name: 'Pacific Fleet',
    minRank: 'O-7',
    description: 'United States Pacific Fleet'
  },
  {
    id: 'lantflt',
    name: 'Atlantic Fleet',
    minRank: 'O-7',
    description: 'United States Atlantic Fleet'
  },
  {
    id: 'naveur',
    name: 'Naval Forces Europe',
    minRank: 'O-7',
    description: 'United States Naval Forces Europe'
  },
  {
    id: 'navcent',
    name: 'Naval Forces Central',
    minRank: 'O-7',
    description: 'United States Naval Forces Central Command'
  }
]

// Helper functions
export function getRankById(id) {
  for (const category in RANKS) {
    const rank = RANKS[category].find(r => r.id === id)
    if (rank) return rank
  }
  return null
}

export function getRankLevel(id) {
  const rank = getRankById(id)
  return rank ? rank.level : 0
}

export function canPromoteTo(userRank, targetRank) {
  const userLevel = getRankLevel(userRank)
  const targetLevel = getRankLevel(targetRank)
  
  // HQ ranks can promote to any rank
  if (userLevel >= getRankLevel('O-7')) {
    return true
  }
  
  // Command level (E-9) can promote up to E-8
  if (userLevel >= getRankLevel('E-9')) {
    return targetLevel <= getRankLevel('E-8')
  }
  
  return false
}

export function getAvailableRanks(userRank) {
  const userLevel = getRankLevel(userRank)
  let allRanks = []
  
  for (const category in RANKS) {
    allRanks = [...allRanks, ...RANKS[category]]
  }
  
  if (userLevel >= getRankLevel('O-7')) {
    return allRanks // HQ can assign any rank
  }
  
  // Command level can only assign up to E-8
  return allRanks.filter(rank => rank.level <= getRankLevel('E-8'))
}

export function getRankCategory(id) {
  for (const category in RANKS) {
    if (RANKS[category].some(r => r.id === id)) return category
  }
  return null
}

export function compareRanks(rank1, rank2) {
  const categories = ['ENLISTED', 'WARRANT', 'OFFICER', 'FLAG', 'SPECIAL']
  const cat1 = getRankCategory(rank1)
  const cat2 = getRankCategory(rank2)
  
  if (cat1 !== cat2) {
    return categories.indexOf(cat1) - categories.indexOf(cat2)
  }
  
  const ranks = RANKS[cat1]
  return ranks.findIndex(r => r.id === rank1) - ranks.findIndex(r => r.id === rank2)
}

export const DEPARTMENTS = [
  'COMMAND',
  'OPERATIONS',
  'LOGISTICS',
  'INTELLIGENCE',
  'MEDICAL',
  'ENGINEERING',
  'SECURITY'
]

export const getAllRanks = () => {
  return [
    ...RANKS.ENLISTED,
    ...RANKS.WARRANT,
    ...RANKS.OFFICER,
    ...RANKS.FLAG,
    ...RANKS.SPECIAL
  ]
}

export const getRanksByCategory = () => RANKS 