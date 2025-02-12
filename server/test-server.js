import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3002

// Basic CORS
app.use(cors())

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Test server running' })
})

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`)
}) 