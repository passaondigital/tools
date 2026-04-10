import OpenAI from 'openai'
import { buildImagePrompt, buildLayoutVariantPrompt } from './promptBuilder.js'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/**
 * Generates a single logo image via DALL-E 3.
 * Returns the image URL (temporary, ~1h expiry from OpenAI).
 */
export async function generateSingleLogo(config, layoutIndex) {
  const basePrompt = buildImagePrompt(config)
  const prompt = buildLayoutVariantPrompt(basePrompt, layoutIndex)

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt,
    n: 1,
    size: '1024x1024',
    quality: 'standard',
    style: 'natural',
    response_format: 'url',
  })

  return response.data[0].url
}

/**
 * Generates all 6 layout variants in parallel (rate-limited to 2 concurrent).
 * Returns array of 6 image URLs.
 */
export async function generateAllVariants(config) {
  const results = []
  // DALL-E 3 allows max 5 requests/min on standard tier — batch in groups of 2
  for (let i = 0; i < 6; i += 2) {
    const batch = [i, i + 1].filter((idx) => idx < 6)
    const batchResults = await Promise.all(
      batch.map((idx) => generateSingleLogo(config, idx))
    )
    results.push(...batchResults)
    if (i + 2 < 6) {
      // Brief pause to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 800))
    }
  }
  return results
}
