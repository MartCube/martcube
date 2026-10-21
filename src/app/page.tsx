import { Header } from '@/components/layout/Header'
import { Contact } from '@/components/slides/Contact'
import { Hero } from '@/components/slides/Hero'
import { Services } from '@/components/slides/Services'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Contact />
      </main>
    </>
  )
}
