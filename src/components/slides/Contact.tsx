import { contact } from '@/content/home'
import { Slide } from './Slide'

// The form arrives in task 3; this slide holds its place.
export function Contact() {
  const [line1, line2] = contact.title

  return (
    <Slide id="contact" aria-label="Contact">
      <div className="max-w-[640px]">
        <h2 className="font-display text-[46px] leading-[0.92] font-bold tracking-[-0.045em] sm:text-[clamp(56px,8vw,120px)]">
          {line1}
          {' '}
          <br />
          <span className="text-lime">{line2}</span>
        </h2>
        <p className="mt-5 max-w-[400px] text-base text-soft sm:mt-8 sm:text-lg">{contact.body}</p>
      </div>
    </Slide>
  )
}
