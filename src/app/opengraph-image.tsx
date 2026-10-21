import { ImageResponse } from 'next/og'
import { hero } from '@/content/home'
import { site } from '@/content/site'

// The preview card shown when the site is shared (WhatsApp, LinkedIn, Slack, X).
// Rendered once at build time.
export const alt = site.title
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const INK = '#0a0b0f'
const PAPER = '#ecebe4'
const LIME = '#c8f542'
const MUTED = '#a9a8a1'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: INK, color: PAPER, padding: 80, justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 640 }}>
          <div style={{ fontSize: 26, letterSpacing: 6, color: LIME, textTransform: 'uppercase', marginBottom: 32 }}>{hero.eyebrow}</div>
          <div style={{ fontSize: 112, fontWeight: 700, lineHeight: 0.95, letterSpacing: -4 }}>{hero.title[0]}</div>
          <div style={{ fontSize: 112, fontWeight: 700, lineHeight: 0.95, letterSpacing: -4, color: LIME }}>{`${hero.title[1]} ${hero.words[0]}`}</div>
          <div style={{ fontSize: 30, color: MUTED, marginTop: 40 }}>{site.name}</div>
        </div>
        <svg width="380" height="400" viewBox="0 0 200 210" fill="none" strokeLinecap="round" strokeWidth="2.4" strokeDasharray="0 6">
          <path d="M20 60 L20 150 L100 190 L180 150 L180 60 M100 100 L100 190" stroke={PAPER} />
          <path d="M100 20 L180 60 L100 100 L20 60 Z" stroke={LIME} />
        </svg>
      </div>
    ),
    size,
  )
}
