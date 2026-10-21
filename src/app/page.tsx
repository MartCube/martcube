import { Header } from '@/components/layout/Header'
import { Hud } from '@/components/layout/Hud'
import { Contact } from '@/components/slides/Contact'
import { Hero } from '@/components/slides/Hero'
import { Services } from '@/components/slides/Services'
import { DeckEngine } from '@/motion/DeckEngine'
import { Scene } from '@/scene/Scene'
import { site } from '@/content/site'

// Tells search engines what MartCube is (shown in rich results).
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  'name': site.name,
  'url': site.url,
  'description': site.description,
  'logo': `${site.url}/brand/icon-512.png`,
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      <Scene />
      <Header />
      <main className="deck:fixed deck:inset-0 deck:overflow-hidden">
        <Hero />
        <Services />
        <Contact />
      </main>
      <Hud />
      <DeckEngine />
    </>
  )
}
