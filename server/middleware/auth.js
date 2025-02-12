export function requireAuth(req, res, next) {
  if (!req.session?.user) {
    return res.status(401).json({ message: 'Authentication required' })
  }
  req.user = req.session.user
  next()
}

export function requireAdmin(req, res, next) {
  if (!req.session?.user?.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

export function requireInstructor(req, res, next) {
  const instructorRanks = ['E-7', 'E-8', 'E-9', 'O-1', 'O-2', 'O-3', 'O-4', 'O-5', 'O-6', 'O-7', 'O-8', 'O-9', 'O-10', 'FADM', 'CNO', 'SECNAV', 'CIC']
  if (!instructorRanks.includes(req.session?.user?.rank)) {
    return res.status(403).json({ message: 'Instructor access required' })
  }
  next()
} 