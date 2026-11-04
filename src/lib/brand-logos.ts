import claude from '@/assets/brands/claude.svg'
import dropbox from '@/assets/brands/dropbox.svg'
import github from '@/assets/brands/github.svg'
import hetzner from '@/assets/brands/hetzner.svg'
import netflix from '@/assets/brands/netflix.svg'
import notion from '@/assets/brands/notion.svg'
import spotify from '@/assets/brands/spotify.svg'
import youtube from '@/assets/brands/youtube.svg'

export interface BrandLogo {
  src: string
  title: string
  color: string
}

const THEME_COLOR = 'currentColor'

const BRAND_LOGOS: Readonly<Record<string, BrandLogo>> = {
  netflix: { src: netflix, title: 'Netflix', color: '#E50914' },
  spotify: { src: spotify, title: 'Spotify', color: '#1ED760' },
  'youtube-premium': { src: youtube, title: 'YouTube', color: '#FF0000' },
  anthropic: { src: claude, title: 'Claude', color: '#D97757' },
  notion: { src: notion, title: 'Notion', color: THEME_COLOR },
  github: { src: github, title: 'GitHub', color: THEME_COLOR },
  dropbox: { src: dropbox, title: 'Dropbox', color: '#0061FF' },
  hetzner: { src: hetzner, title: 'Hetzner', color: '#D50C2D' },
}

export function getBrandLogo(merchantKey: string | null | undefined): BrandLogo | null {
  if (!merchantKey || !Object.hasOwn(BRAND_LOGOS, merchantKey)) return null
  return BRAND_LOGOS[merchantKey]
}
