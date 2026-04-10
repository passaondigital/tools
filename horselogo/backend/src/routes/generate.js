import { Router } from 'express'
import { supabase } from '../lib/supabase.js'
import { generateAllVariants } from '../lib/imageGen.js'
import { applyWatermark } from '../lib/watermark.js'

const router = Router()

/**
 * POST /api/generate
 * Body: LogoConfig (businessName, tagline, industry, motif, style, palette, colorPrimary, colorSecondary)
 * Response: { logoId, variants: [{ id, layout, previewUrl }] }
 */
router.post('/', async (req, res) => {
  const {
    businessName,
    tagline,
    industry,
    motif,
    style,
    palette,
    colorPrimary,
    colorSecondary,
  } = req.body

  if (!businessName?.trim() || !motif || !style) {
    return res.status(400).json({ message: 'businessName, motif und style sind erforderlich.' })
  }

  try {
    // 1. Generate 6 logo images via DALL-E 3
    const rawUrls = await generateAllVariants({
      businessName: businessName.trim(),
      tagline: tagline?.trim() || '',
      industry: industry || 'sonstiges',
      motif,
      style,
      palette: palette || 'noir-gold',
      colorPrimary: colorPrimary || '#0D0D0D',
      colorSecondary: colorSecondary || '#C9A84C',
    })

    // 2. Apply watermarks and upload to Supabase Storage
    const previewUrls = []
    for (let i = 0; i < rawUrls.length; i++) {
      const watermarked = await applyWatermark(rawUrls[i])
      const fileName = `previews/${Date.now()}_${i}.png`
      const { error: uploadErr } = await supabase.storage
        .from('logos')
        .upload(fileName, watermarked, { contentType: 'image/png', upsert: false })
      if (uploadErr) throw new Error(`Upload failed: ${uploadErr.message}`)
      const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(fileName)
      previewUrls.push(publicUrl)
    }

    // 3. Store logo record in DB
    const { data: logo, error: dbErr } = await supabase
      .from('logos')
      .insert({
        business_name: businessName.trim(),
        tagline: tagline?.trim() || null,
        industry: industry || 'sonstiges',
        motif,
        style,
        palette: palette || 'noir-gold',
        color_primary: colorPrimary || '#0D0D0D',
        color_secondary: colorSecondary || '#C9A84C',
        preview_urls: previewUrls,
        raw_urls: rawUrls,
        status: 'preview',
        ip_address: req.ip,
      })
      .select('id')
      .single()

    if (dbErr) throw new Error(`DB insert failed: ${dbErr.message}`)

    res.json({
      logoId: logo.id,
      variants: previewUrls.map((url, i) => ({
        id: i,
        layout: i,
        previewUrl: url,
      })),
    })
  } catch (err) {
    console.error('Generate error:', err)
    res.status(500).json({ message: err.message || 'Generierung fehlgeschlagen' })
  }
})

export default router
