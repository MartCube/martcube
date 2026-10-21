import { Header } from '@/components/layout/Header'
import { Hud } from '@/components/layout/Hud'
import { Contact } from '@/components/slides/Contact'
import { Hero } from '@/components/slides/Hero'
import { Services } from '@/components/slides/Services'
import { ScrollEngine } from '@/motion/ScrollEngine'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Contact />
      </main>
      <Hud />
      <ScrollEngine />
    </>
  )
}
