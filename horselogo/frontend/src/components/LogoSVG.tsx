/**
 * SVG-based logo preview renderer.
 * Generates 6 layout variants entirely in the browser — no image API needed for previews.
 * After payment, the backend generates the high-res production files.
 */

import type { LogoConfig } from '../types'
import { PALETTES } from '../lib/constants'

interface Props {
  config: LogoConfig
  layout: number  // 0–5
  size?: number   // canvas size in px
  watermark?: boolean
}

function getColors(config: LogoConfig) {
  if (config.palette === 'custom') {
    return { primary: config.colorPrimary || '#0D0D0D', secondary: config.colorSecondary || '#C9A84C' }
  }
  const palette = PALETTES.find((p) => p.value === config.palette)
  return {
    primary: palette?.primary ?? '#0D0D0D',
    secondary: palette?.secondary ?? '#C9A84C',
  }
}

/** Minimalistic horse-head path (scalable SVG path) */
const HORSE_HEAD_PATH = `
  M 50 15
  C 45 10, 38 8, 34 12
  C 30 16, 30 22, 28 26
  C 25 30, 18 32, 16 36
  C 14 40, 15 46, 18 50
  C 21 54, 26 56, 30 57
  L 30 70
  C 30 72, 32 74, 35 74
  L 42 74
  C 44 74, 46 72, 46 70
  L 46 60
  C 52 62, 58 62, 63 58
  C 68 54, 70 48, 68 42
  C 72 40, 74 36, 72 32
  C 70 28, 65 26, 60 28
  C 58 22, 55 16, 50 15
  Z
`

const HORSESHOE_PATH = `
  M 50 20
  C 34 20, 20 34, 20 50
  C 20 62, 26 72, 35 78
  L 38 78
  C 29 72, 24 62, 24 50
  C 24 36, 36 24, 50 24
  C 64 24, 76 36, 76 50
  C 76 62, 71 72, 62 78
  L 65 78
  C 74 72, 80 62, 80 50
  C 80 34, 66 20, 50 20
  Z
  M 35 80 L 38 92 L 42 92 L 42 80 Z
  M 58 80 L 62 80 L 62 92 L 58 92 Z
`

const RUNNING_HORSE_PATH = `
  M 15 60
  C 20 50, 28 45, 34 46
  L 30 35
  C 28 30, 32 25, 38 26
  C 42 27, 44 30, 43 35
  L 48 32
  C 54 28, 62 30, 65 36
  C 68 42, 66 48, 60 52
  L 72 48
  C 76 47, 80 50, 78 56
  C 76 62, 70 64, 64 62
  L 60 68
  C 58 72, 52 74, 46 70
  L 40 76
  C 38 80, 32 80, 30 76
  L 28 68
  C 24 70, 18 68, 15 64
  Z
`

function getMotifPath(motif: string | null): string {
  switch (motif) {
    case 'hufeisen': return HORSESHOE_PATH
    case 'galoppierend':
    case 'steigend':
    case 'springend': return RUNNING_HORSE_PATH
    default: return HORSE_HEAD_PATH
  }
}

export default function LogoSVG({ config, layout, size = 280, watermark = true }: Props) {
  const { primary, secondary } = getColors(config)
  const name = config.businessName || 'Your Business'
  const tagline = config.tagline || ''
  const motifPath = getMotifPath(config.motif)

  // Determine font based on style
  const isVintage = config.style === 'vintage'
  const fontFamily = isVintage ? "'Cormorant Garamond', serif" : "'DM Sans', sans-serif"
  const nameFontFamily = "'Cormorant Garamond', serif"

  const bgColor = primary
  const accentColor = secondary

  const renderLayout = () => {
    switch (layout) {
      // Layout 0: Centered classic (icon top, name, tagline)
      case 0:
        return (
          <g>
            <rect width={size} height={size} fill={bgColor} />
            <g transform={`translate(${size / 2 - 40}, ${size * 0.12}) scale(0.8)`}>
              <path d={motifPath} fill={accentColor} />
            </g>
            <text
              x={size / 2}
              y={size * 0.62}
              textAnchor="middle"
              fontFamily={nameFontFamily}
              fontSize={size * 0.1}
              fontWeight="700"
              fill="#E8E4DD"
              letterSpacing="0.05em"
            >
              {name.toUpperCase()}
            </text>
            {tagline && (
              <text
                x={size / 2}
                y={size * 0.72}
                textAnchor="middle"
                fontFamily={fontFamily}
                fontSize={size * 0.045}
                fill={accentColor}
                letterSpacing="0.18em"
              >
                {tagline.toUpperCase()}
              </text>
            )}
            <line
              x1={size * 0.25} y1={size * 0.66}
              x2={size * 0.75} y2={size * 0.66}
              stroke={accentColor} strokeWidth="0.5" opacity="0.4"
            />
          </g>
        )

      // Layout 1: Horizontal (icon left, text right)
      case 1:
        return (
          <g>
            <rect width={size} height={size} fill={bgColor} />
            <g transform={`translate(${size * 0.08}, ${size * 0.3}) scale(0.65)`}>
              <path d={motifPath} fill={accentColor} />
            </g>
            <line
              x1={size * 0.42} y1={size * 0.32}
              x2={size * 0.42} y2={size * 0.68}
              stroke={accentColor} strokeWidth="0.5" opacity="0.4"
            />
            <text
              x={size * 0.48}
              y={size * 0.48}
              fontFamily={nameFontFamily}
              fontSize={size * 0.09}
              fontWeight="700"
              fill="#E8E4DD"
              letterSpacing="0.04em"
            >
              {name.length > 12 ? name.substring(0, 12) : name}
            </text>
            {tagline && (
              <text
                x={size * 0.48}
                y={size * 0.6}
                fontFamily={fontFamily}
                fontSize={size * 0.04}
                fill={accentColor}
                letterSpacing="0.12em"
              >
                {tagline.toUpperCase()}
              </text>
            )}
          </g>
        )

      // Layout 2: Badge / Emblem
      case 2:
        return (
          <g>
            <rect width={size} height={size} fill={bgColor} />
            <circle
              cx={size / 2} cy={size / 2}
              r={size * 0.42}
              fill="none"
              stroke={accentColor}
              strokeWidth="1"
              opacity="0.6"
            />
            <circle
              cx={size / 2} cy={size / 2}
              r={size * 0.38}
              fill="none"
              stroke={accentColor}
              strokeWidth="0.3"
              opacity="0.3"
            />
            <g transform={`translate(${size / 2 - 36}, ${size * 0.22}) scale(0.72)`}>
              <path d={motifPath} fill={accentColor} />
            </g>
            <text
              x={size / 2}
              y={size * 0.63}
              textAnchor="middle"
              fontFamily={nameFontFamily}
              fontSize={size * 0.085}
              fontWeight="700"
              fill="#E8E4DD"
              letterSpacing="0.06em"
            >
              {name.toUpperCase().substring(0, 14)}
            </text>
            {tagline && (
              <text
                x={size / 2}
                y={size * 0.73}
                textAnchor="middle"
                fontFamily={fontFamily}
                fontSize={size * 0.038}
                fill={accentColor}
                letterSpacing="0.2em"
              >
                {tagline.toUpperCase()}
              </text>
            )}
          </g>
        )

      // Layout 3: Stacked with dividers
      case 3:
        return (
          <g>
            <rect width={size} height={size} fill={bgColor} />
            <text
              x={size / 2}
              y={size * 0.3}
              textAnchor="middle"
              fontFamily={fontFamily}
              fontSize={size * 0.038}
              fontWeight="700"
              fill={accentColor}
              letterSpacing="0.25em"
            >
              ✦ ESTABLISHED ✦
            </text>
            <line
              x1={size * 0.15} y1={size * 0.35}
              x2={size * 0.85} y2={size * 0.35}
              stroke={accentColor} strokeWidth="0.5" opacity="0.4"
            />
            <text
              x={size / 2}
              y={size * 0.5}
              textAnchor="middle"
              fontFamily={nameFontFamily}
              fontSize={size * 0.11}
              fontWeight="800"
              fill="#E8E4DD"
              letterSpacing="0.04em"
            >
              {name.toUpperCase().substring(0, 12)}
            </text>
            <line
              x1={size * 0.15} y1={size * 0.56}
              x2={size * 0.85} y2={size * 0.56}
              stroke={accentColor} strokeWidth="0.5" opacity="0.4"
            />
            {tagline && (
              <text
                x={size / 2}
                y={size * 0.65}
                textAnchor="middle"
                fontFamily={fontFamily}
                fontSize={size * 0.042}
                fill={accentColor}
                letterSpacing="0.15em"
              >
                {tagline.toUpperCase()}
              </text>
            )}
            <g transform={`translate(${size / 2 - 15}, ${size * 0.7}) scale(0.3)`}>
              <path d={motifPath} fill={accentColor} opacity="0.7" />
            </g>
          </g>
        )

      // Layout 4: Minimal mark (large icon, small name)
      case 4:
        return (
          <g>
            <rect width={size} height={size} fill={bgColor} />
            <g transform={`translate(${size / 2 - 50}, ${size * 0.15}) scale(1.0)`}>
              <path d={motifPath} fill={accentColor} />
            </g>
            <text
              x={size / 2}
              y={size * 0.82}
              textAnchor="middle"
              fontFamily={nameFontFamily}
              fontSize={size * 0.065}
              fontWeight="600"
              fill="rgba(232,228,221,0.5)"
              letterSpacing="0.25em"
            >
              {name.toUpperCase().substring(0, 16)}
            </text>
          </g>
        )

      // Layout 5: Left-aligned editorial
      case 5:
        return (
          <g>
            <rect width={size} height={size} fill={bgColor} />
            <line
              x1={size * 0.1} y1={size * 0.2}
              x2={size * 0.1} y2={size * 0.8}
              stroke={accentColor} strokeWidth="2"
            />
            <g transform={`translate(${size * 0.18}, ${size * 0.18}) scale(0.6)`}>
              <path d={motifPath} fill={accentColor} />
            </g>
            <text
              x={size * 0.18}
              y={size * 0.58}
              fontFamily={nameFontFamily}
              fontSize={size * 0.1}
              fontWeight="700"
              fill="#E8E4DD"
              letterSpacing="0.02em"
            >
              {name.length > 10 ? name.substring(0, 10) : name}
            </text>
            {tagline && (
              <text
                x={size * 0.18}
                y={size * 0.7}
                fontFamily={fontFamily}
                fontSize={size * 0.042}
                fill={accentColor}
                letterSpacing="0.12em"
              >
                {tagline.toUpperCase()}
              </text>
            )}
          </g>
        )

      default:
        return null
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {renderLayout()}
      {watermark && (
        <g>
          <text
            x={size / 2}
            y={size / 2 + 8}
            textAnchor="middle"
            fontFamily="'DM Sans', sans-serif"
            fontSize={size * 0.045}
            fontWeight="700"
            letterSpacing="0.15em"
            fill="rgba(255,255,255,0.18)"
            transform={`rotate(-30, ${size / 2}, ${size / 2})`}
          >
            HORSELOGO.DE PREVIEW
          </text>
          <text
            x={size / 2}
            y={size / 2 + size * 0.08}
            textAnchor="middle"
            fontFamily="'DM Sans', sans-serif"
            fontSize={size * 0.045}
            fontWeight="700"
            letterSpacing="0.15em"
            fill="rgba(255,255,255,0.12)"
            transform={`rotate(-30, ${size / 2}, ${size / 2})`}
          >
            HORSELOGO.DE PREVIEW
          </text>
        </g>
      )}
    </svg>
  )
}
