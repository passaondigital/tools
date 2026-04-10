import { Router } from 'express'
import { supabase } from '../lib/supabase.js'

const router = Router()

/**
 * GET /api/download/:orderId
 * Returns the download ZIP URL for a paid order.
 * Response: { zipUrl, expiresAt }
 */
router.get('/:orderId', async (req, res) => {
  const { orderId } = req.params

  if (!orderId) {
    return res.status(400).json({ message: 'orderId fehlt.' })
  }

  try {
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, status, zip_url, download_count, max_downloads, customer_email, created_at')
      .eq('id', orderId)
      .single()

    if (error || !order) {
      return res.status(404).json({ message: 'Bestellung nicht gefunden.' })
    }

    if (order.status !== 'paid') {
      return res.status(402).json({ message: 'Zahlung noch nicht abgeschlossen.' })
    }

    if (!order.zip_url) {
      return res.status(202).json({ message: 'Download wird vorbereitet. Bitte kurz warten.' })
    }

    if (order.download_count >= order.max_downloads) {
      return res.status(403).json({ message: 'Download-Limit erreicht. Kontakt: support@hufmanager.de' })
    }

    // Increment download counter
    await supabase
      .from('orders')
      .update({ download_count: order.download_count + 1 })
      .eq('id', orderId)

    // Calculate expiry (signed URLs are valid 7 days from creation)
    const createdAt = new Date(order.created_at)
    const expiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000)

    res.json({
      zipUrl: order.zip_url,
      expiresAt: expiresAt.toISOString(),
      downloadsRemaining: order.max_downloads - order.download_count - 1,
    })
  } catch (err) {
    console.error('Download error:', err)
    res.status(500).json({ message: 'Download nicht verfügbar.' })
  }
})

export default router
