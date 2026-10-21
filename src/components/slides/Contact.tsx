import { Lines } from '@/components/motion/Lines'
import { contact } from '@/content/home'
import { ContactForm } from './ContactForm'
import { Slide } from './Slide'

export function Contact() {
  const [line1, line2] = contact.title

  return (
    <Slide id="contact" aria-label="Contact">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
        <div className="min-w-0 lg:flex-1">
          <h2 className="font-display text-[46px] leading-[0.92] font-bold tracking-[-0.045em] sm:text-[clamp(56px,7vw,104px)]">
            <Lines lines={[line1, <span key="2" className="text-lime">{line2}</span>]} />
          </h2>
          <p data-reveal="item" className="mt-4 max-w-[400px] text-base text-balance text-soft sm:mt-8 sm:text-lg">{contact.body}</p>
        </div>
        <div data-reveal="item" className="w-full lg:w-[520px] lg:flex-none">
          <ContactForm />
        </div>
      </div>
    </Slide>
  )
}
