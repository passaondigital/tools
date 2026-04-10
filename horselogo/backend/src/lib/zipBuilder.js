import archiver from 'archiver'
import sharp from 'sharp'
import { Readable } from 'stream'

/**
 * Builds the complete download ZIP package for a purchased logo.
 *
 * Package contents:
 * - logo_original.png (3000x3000, transparent)
 * - logo_inverted.png
 * - logo_grayscale.png
 * - logo_warm.png
 * - logo_cool.png
 * - social/instagram_1080x1080.png
 * - social/facebook_820x312.png
 * - social/whatsapp_500x500.png
 * - business_card/front_85x55mm.png
 * - README.txt
 *
 * Returns a Buffer of the ZIP file.
 */
export async function buildDownloadZip(logoBuffer, businessName) {
  return new Promise(async (resolve, reject) => {
    const chunks = []

    const archive = archiver('zip', { zlib: { level: 6 } })
    archive.on('data', (chunk) => chunks.push(chunk))
    archive.on('end', () => resolve(Buffer.concat(chunks)))
    archive.on('error', reject)

    const base = sharp(logoBuffer)

    // Original PNG 3000x3000
    const original = await base.clone().resize(3000, 3000, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    }).png().toBuffer()
    archive.append(original, { name: 'logo_original.png' })

    // Color variants
    const inverted = await base.clone().negate({ alpha: false }).resize(3000, 3000, {
      fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 },
    }).png().toBuffer()
    archive.append(inverted, { name: 'logo_inverted.png' })

    const grayscale = await base.clone().grayscale().resize(3000, 3000, {
      fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 },
    }).png().toBuffer()
    archive.append(grayscale, { name: 'logo_grayscale.png' })

    const warm = await base.clone().modulate({ saturation: 1.3, hue: 15 }).resize(3000, 3000, {
      fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 },
    }).png().toBuffer()
    archive.append(warm, { name: 'logo_warm.png' })

    const cool = await base.clone().modulate({ saturation: 0.8, hue: -15 }).resize(3000, 3000, {
      fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 },
    }).png().toBuffer()
    archive.append(cool, { name: 'logo_cool.png' })

    // Social media formats (at 150dpi effective)
    const instagram = await base.clone().resize(1080, 1080, {
      fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 255 },
    }).png().toBuffer()
    archive.append(instagram, { name: 'social/instagram_1080x1080.png' })

    const facebook = await base.clone().resize(820, 312, {
      fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 255 },
    }).png().toBuffer()
    archive.append(facebook, { name: 'social/facebook_820x312.png' })

    const whatsapp = await base.clone().resize(500, 500, {
      fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 255 },
    }).png().toBuffer()
    archive.append(whatsapp, { name: 'social/whatsapp_500x500.png' })

    // Business card layout: 85mm x 55mm @ 300dpi = 1004x650px
    const bizCard = await base.clone().resize(700, 450, {
      fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 255 },
    }).png().toBuffer()
    archive.append(bizCard, { name: 'business_card/front_85x55mm.png' })

    // README
    const readme = `HorseLogo.de — Dein professionelles Pferde-Logo
================================================

Unternehmensname: ${businessName}

ENTHALTENE DATEIEN:
-------------------
logo_original.png    — 3000x3000px, transparenter Hintergrund
logo_inverted.png    — Invertierte Farbversion
logo_grayscale.png   — Schwarz-Weiß-Version
logo_warm.png        — Warme Farbvariante
logo_cool.png        — Kühle Farbvariante

social/
  instagram_1080x1080.png  — Instagram Post / Story
  facebook_820x312.png     — Facebook Titelseite
  whatsapp_500x500.png     — WhatsApp Profilbild

business_card/
  front_85x55mm.png        — Visitenkarten-Layout (300dpi)

NUTZUNGSRECHTE:
---------------
Mit dem Kauf erhältst du ein nicht-exklusives, weltweites,
zeitlich unbefristetes Nutzungsrecht für kommerzielle und
private Zwecke. Eine Weiterveräußerung der Rohdateien ist
nicht gestattet.

SUPPORT:
--------
Bei Fragen: support@hufmanager.de
Website: https://horselogo.de

© 2026 HorseLogo.de — Pascal Schmid
`
    archive.append(readme, { name: 'README.txt' })

    archive.finalize()
  })
}
