/**
 * Builds optimized image-generation prompts from user logo config.
 * Uses branche-specific knowledge to create tailored equestrian logos.
 */

const MOTIF_DESCRIPTIONS = {
  'kopf-profil': 'elegant horse head in side profile, flowing mane',
  'kopf-frontal': 'powerful horse head facing forward, intense gaze',
  'galoppierend': 'horse galloping at full speed, dynamic motion blur',
  'steigend': 'rearing horse on hind legs, powerful and majestic',
  'springend': 'horse mid-jump over fence, athletic form',
  'dressur': 'dressage horse in piaffe or passage movement, precise elegance',
  'hufeisen': 'horseshoe symbol, traditional farrier icon',
  'huf-barhuf': 'horse hoof close-up, natural barefoot hoof care',
  'western': 'western horse silhouette with cowboy hat, ranch aesthetic',
  'abstrakt': 'abstract geometric horse form, modern minimalist',
  'stute-fohlen': 'mare and foal together, nurturing bond',
  'keltisch': 'Celtic horse knotwork design, heritage and tradition',
}

const INDUSTRY_CONTEXT = {
  'reitstall': 'equestrian riding school and stable',
  'hufpflege': 'natural hoof care and farrier services',
  'pferdezucht': 'horse breeding and stud farm',
  'osteopathie': 'equine osteopathy and physiotherapy',
  'turnier': 'equestrian competition and riding club',
  'pferdehandel': 'horse trading and sales',
  'shop': 'equestrian sports and riding equipment shop',
  'pension': 'horse boarding and livery yard',
  'western': 'western ranch and cowboy riding',
  'transport': 'horse transport and logistics',
  'tierarzt': 'equine veterinary clinic',
  'sonstiges': 'equestrian business',
}

const STYLE_DESCRIPTORS = {
  'minimalistisch': 'minimalist clean lines, simple geometric, maximum whitespace, refined reduction',
  'elegant': 'elegant sophisticated, fine lines, graceful curves, luxury brand aesthetic',
  'kraftvoll': 'bold strong lines, high contrast, powerful impactful, commanding presence',
  'vintage': 'vintage retro badge style, distressed textures, heritage typography, nostalgic',
  'geometrisch': 'geometric shapes, precise angles, structured symmetry, modern corporate',
  'handgezeichnet': 'hand-drawn illustration style, organic natural lines, artisanal craft feel',
}

export function buildImagePrompt(config) {
  const motifDesc = MOTIF_DESCRIPTIONS[config.motif] || config.motif
  const industryCtx = INDUSTRY_CONTEXT[config.industry] || 'equestrian business'
  const styleDesc = STYLE_DESCRIPTORS[config.style] || config.style
  const primaryColor = config.colorPrimary || '#0D0D0D'
  const accentColor = config.colorSecondary || '#C9A84C'
  const name = config.businessName

  return `Professional logo design for "${name}", a ${industryCtx}.

Visual concept: ${motifDesc}
Design style: ${styleDesc}
Color palette: primary ${primaryColor}, accent ${accentColor}
${config.tagline ? `Tagline text: "${config.tagline}"` : 'No tagline'}

Requirements:
- Vector-quality logo, clean professional lines
- White/transparent background
- Suitable for both small (favicon 32px) and large (banner 1200px) usage
- NOT clipart, NOT generic stock illustration
- High-end equestrian brand aesthetic
- Single cohesive composition
- No extra decorative elements beyond the core mark
- Text if included: business name "${name}"${config.tagline ? ` and tagline "${config.tagline}"` : ''}

Output: Centered logo on pure white background, square format`
}

export function buildLayoutVariantPrompt(basePrompt, layoutIndex) {
  const layouts = [
    'centered stacked layout: icon top, business name below, tagline bottom',
    'horizontal layout: icon on left side, company name and tagline on right',
    'circular badge emblem: circular border containing icon and text',
    'stacked layout with decorative horizontal lines as dividers',
    'minimal mark: dominant large icon with small text underneath',
    'left-aligned editorial: vertical accent line on left, text and icon right-aligned',
  ]
  return `${basePrompt}\n\nLayout style: ${layouts[layoutIndex] || layouts[0]}`
}
