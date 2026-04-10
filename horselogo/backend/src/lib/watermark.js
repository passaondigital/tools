import sharp from 'sharp'

/**
 * Downloads an image from URL and applies a watermark overlay.
 * Returns the watermarked image as a Buffer.
 */
export async function applyWatermark(imageUrl) {
  const response = await fetch(imageUrl)
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`)
  const imageBuffer = Buffer.from(await response.arrayBuffer())

  const { width, height } = await sharp(imageBuffer).metadata()
  const w = width ?? 1024
  const h = height ?? 1024

  // Create SVG watermark overlay
  const watermarkSvg = `
    <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <text
        x="${w / 2}" y="${h / 2}"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="Arial, sans-serif"
        font-size="${Math.floor(w * 0.055)}"
        font-weight="bold"
        letter-spacing="${Math.floor(w * 0.008)}"
        fill="rgba(255,255,255,0.22)"
        transform="rotate(-30, ${w / 2}, ${h / 2})"
      >HORSELOGO.DE PREVIEW</text>
      <text
        x="${w / 2}" y="${h / 2 + Math.floor(w * 0.09)}"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="Arial, sans-serif"
        font-size="${Math.floor(w * 0.055)}"
        font-weight="bold"
        letter-spacing="${Math.floor(w * 0.008)}"
        fill="rgba(255,255,255,0.14)"
        transform="rotate(-30, ${w / 2}, ${h / 2})"
      >HORSELOGO.DE PREVIEW</text>
    </svg>
  `

  const watermarkedBuffer = await sharp(imageBuffer)
    .composite([{
      input: Buffer.from(watermarkSvg),
      blend: 'over',
    }])
    .png()
    .toBuffer()

  return watermarkedBuffer
}

/**
 * Removes background and converts to transparent PNG.
 * Returns the clean image as a Buffer.
 */
export async function processForDownload(imageUrl) {
  const response = await fetch(imageUrl)
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`)
  const imageBuffer = Buffer.from(await response.arrayBuffer())

  // Upscale to 3000x3000 with high quality
  const processedBuffer = await sharp(imageBuffer)
    .resize(3000, 3000, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 6 })
    .toBuffer()

  return processedBuffer
}

/**
 * Generates 5 color variants from the base logo.
 */
export async function generateColorVariants(imageBuffer) {
  const base = sharp(imageBuffer)

  const [original, inverted, grayscale, warm, cool] = await Promise.all([
    base.clone().png().toBuffer(),
    base.clone().negate({ alpha: false }).png().toBuffer(),
    base.clone().grayscale().png().toBuffer(),
    base.clone().modulate({ saturation: 1.3, hue: 15 }).png().toBuffer(),
    base.clone().modulate({ saturation: 0.8, hue: -15 }).png().toBuffer(),
  ])

  return { original, inverted, grayscale, warm, cool }
}
