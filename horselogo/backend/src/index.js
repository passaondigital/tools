import 'dotenv/config'
import express from 'express'
import generateRouter from './routes/generate.js'
import checkoutRouter from './routes/checkout.js'
import webhookRouter from './routes/webhook.js'
import downloadRouter from './routes/download.js'

const app = express()
const PORT = process.env.PORT || 3001

// ── Stripe webhook needs raw body for signature verification ──
app.use('/api/webhook', express.raw({ type: 'application/json' }))

// ── All other routes use JSON ──
app.use(express.json({ limit: '1mb' }))

// ── Security headers ──
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  next()
})

// ── CORS (allow frontend origin in dev) ──
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://horselogo.de',
    'https://www.horselogo.de',
    process.env.FRONTEND_URL,
  ].filter(Boolean)

  const origin = req.headers.origin
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

// ── Routes ──
app.use('/api/generate', generateRouter)
app.use('/api/checkout', checkoutRouter)
app.use('/api/webhook', webhookRouter)
app.use('/api/download', downloadRouter)

// ── Health check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'horselogo-backend', timestamp: new Date().toISOString() })
})

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

// ── Error handler ──
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🐴 HorseLogo backend running on http://localhost:${PORT}`)
})
