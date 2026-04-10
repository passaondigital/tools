import { Router } from 'express'
import Stripe from 'stripe'
import { supabase } from '../lib/supabase.js'

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://horselogo.de'
const PRICE_CENTS = 999  // €9.99

/**
 * POST /api/checkout
 * Body: { logoId, variant }
 * Response: { checkoutUrl }
 */
router.post('/', async (req, res) => {
  const { logoId, variant } = req.body

  if (!logoId || variant === undefined) {
    return res.status(400).json({ message: 'logoId und variant sind erforderlich.' })
  }

  try {
    // Verify logo exists
    const { data: logo, error: logoErr } = await supabase
      .from('logos')
      .select('id, business_name, status')
      .eq('id', logoId)
      .single()

    if (logoErr || !logo) {
      return res.status(404).json({ message: 'Logo nicht gefunden.' })
    }

    // Create order record
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({
        logo_id: logoId,
        amount_cents: PRICE_CENTS,
        currency: 'eur',
        status: 'pending',
      })
      .select('id')
      .single()

    if (orderErr) throw new Error(`Order creation failed: ${orderErr.message}`)

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: PRICE_CENTS,
            product_data: {
              name: `HorseLogo — ${logo.business_name}`,
              description: 'Professionelles Pferde-Logo. PNG 3000×3000, SVG, 5 Farbvarianten, Social Media Kit.',
              images: [],
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${FRONTEND_URL}/download?order_id=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/?step=4&logo_id=${logoId}`,
      metadata: {
        orderId: order.id,
        logoId,
        variant: String(variant),
      },
      payment_intent_data: {
        metadata: { orderId: order.id, logoId },
      },
      allow_promotion_codes: false,
      billing_address_collection: 'required',
      customer_creation: 'if_required',
    })

    // Save session ID to order
    await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id)

    res.json({ checkoutUrl: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    res.status(500).json({ message: err.message || 'Checkout fehlgeschlagen' })
  }
})

export default router
