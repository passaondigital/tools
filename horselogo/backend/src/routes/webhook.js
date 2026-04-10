import { Router } from 'express'
import Stripe from 'stripe'
import { supabase } from '../lib/supabase.js'
import { buildDownloadZip } from '../lib/zipBuilder.js'

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

/**
 * POST /api/webhook/stripe
 * Raw body required for signature verification.
 * Triggered by Stripe on checkout.session.completed.
 */
router.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type !== 'checkout.session.completed') {
    return res.json({ received: true })
  }

  const session = event.data.object
  const { orderId, logoId, variant } = session.metadata ?? {}

  if (!orderId || !logoId) {
    console.error('Missing metadata in webhook event:', session.id)
    return res.status(400).json({ message: 'Missing metadata' })
  }

  try {
    // 1. Update order status
    await supabase
      .from('orders')
      .update({
        status: 'paid',
        stripe_payment_id: session.payment_intent,
        customer_email: session.customer_details?.email,
      })
      .eq('id', orderId)

    // 2. Fetch logo data
    const { data: logo, error: logoErr } = await supabase
      .from('logos')
      .select('*')
      .eq('id', logoId)
      .single()

    if (logoErr || !logo) throw new Error('Logo not found')

    const variantIndex = parseInt(variant ?? '0', 10)
    const rawUrl = logo.raw_urls?.[variantIndex] ?? logo.raw_urls?.[0]

    if (!rawUrl) throw new Error('No raw URL found for variant')

    // 3. Download the chosen variant image
    const response = await fetch(rawUrl)
    if (!response.ok) throw new Error(`Failed to fetch raw image: ${response.statusText}`)
    const imageBuffer = Buffer.from(await response.arrayBuffer())

    // 4. Build ZIP package
    const zipBuffer = await buildDownloadZip(imageBuffer, logo.business_name)

    // 5. Upload ZIP to Supabase Storage
    const zipFileName = `downloads/${orderId}.zip`
    const { error: uploadErr } = await supabase.storage
      .from('logos')
      .upload(zipFileName, zipBuffer, {
        contentType: 'application/zip',
        upsert: true,
      })
    if (uploadErr) throw new Error(`ZIP upload failed: ${uploadErr.message}`)

    // 6. Create signed download URL (valid 7 days)
    const { data: signedData, error: signErr } = await supabase.storage
      .from('logos')
      .createSignedUrl(zipFileName, 60 * 60 * 24 * 7)
    if (signErr) throw new Error(`Signed URL creation failed: ${signErr.message}`)

    // 7. Update logo and order records
    await Promise.all([
      supabase
        .from('logos')
        .update({
          status: 'paid',
          selected_variant: variantIndex,
          zip_url: signedData.signedUrl,
          stripe_payment_id: session.payment_intent,
          customer_email: session.customer_details?.email,
        })
        .eq('id', logoId),
      supabase
        .from('orders')
        .update({ zip_url: signedData.signedUrl })
        .eq('id', orderId),
    ])

    console.log(`✓ Logo ${logoId} processed for order ${orderId}`)
    res.json({ received: true })
  } catch (err) {
    console.error('Webhook processing error:', err)
    // Return 200 to prevent Stripe retries for processing errors
    // (retries would re-trigger processing on already-paid orders)
    res.json({ received: true, error: err.message })
  }
})

export default router
