export type Industry =
  | 'reitstall'
  | 'hufpflege'
  | 'pferdezucht'
  | 'osteopathie'
  | 'turnier'
  | 'pferdehandel'
  | 'shop'
  | 'pension'
  | 'western'
  | 'transport'
  | 'tierarzt'
  | 'sonstiges'

export type Motif =
  | 'kopf-profil'
  | 'kopf-frontal'
  | 'galoppierend'
  | 'steigend'
  | 'springend'
  | 'dressur'
  | 'hufeisen'
  | 'huf-barhuf'
  | 'western'
  | 'abstrakt'
  | 'stute-fohlen'
  | 'keltisch'

export type DesignStyle =
  | 'minimalistisch'
  | 'elegant'
  | 'kraftvoll'
  | 'vintage'
  | 'geometrisch'
  | 'handgezeichnet'

export type ColorPalette =
  | 'noir-gold'
  | 'midnight-silver'
  | 'erde-warm'
  | 'forest-moss'
  | 'bordeaux'
  | 'ocean-pearl'
  | 'pure-mono'
  | 'custom'

export interface LogoConfig {
  businessName: string
  tagline: string
  industry: Industry | null
  motif: Motif | null
  style: DesignStyle | null
  palette: ColorPalette | null
  colorPrimary: string
  colorSecondary: string
}

export interface LogoVariant {
  id: number
  layout: string
  previewUrl: string
}

export interface GeneratedLogo {
  logoId: string
  variants: LogoVariant[]
}
