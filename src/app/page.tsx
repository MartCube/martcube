import { Header } from '@/components/layout/Header'
import { Hud } from '@/components/layout/Hud'
import { Contact } from '@/components/slides/Contact'
import { Hero } from '@/components/slides/Hero'
import { Services } from '@/components/slides/Services'
import { ScrollEngine } from '@/motion/ScrollEngine'
import { Scene } from '@/scene/Scene'

export default function Home() {
  return (
    <>
      <Scene />
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
