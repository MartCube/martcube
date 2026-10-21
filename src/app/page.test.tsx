import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { services } from '@/content/home'
import { StoreProvider } from '@/store/StoreProvider'
import Home from './page'

function renderHome() {
  return render(<StoreProvider><Home /></StoreProvider>)
}

describe('Home', () => {
  it('renders the three slides in order', () => {
    renderHome()

    // The deck hides the slides that aren't showing, so count them all here.
    const regions = screen.getAllByRole('region', { hidden: true }).map(r => r.getAttribute('aria-label'))
    expect(regions).toEqual(['Intro', 'Services', 'Contact'])
    expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName('Websites that move.')
  })

  it('exposes only the slide that is showing', () => {
    renderHome()

    expect(screen.getAllByRole('region').map(r => r.getAttribute('aria-label'))).toEqual(['Intro'])
    expect(document.getElementById('contact')).toHaveProperty('inert', true)
  })

  it('shows one panel per service, each reachable from the tabs', () => {
    renderHome()

    // Queried directly: the services slide starts hidden behind the hero.
    const tabs = Array.from(document.querySelectorAll('nav[aria-label="Services"] a'))
    expect(tabs).toHaveLength(services.items.length)
    for (const [i, item] of services.items.entries()) {
      expect(tabs[i]).toHaveAttribute('href', `#${item.id}`)
      expect(document.getElementById(item.id)).toBeInTheDocument()
    }
  })

  it('points the calls to action at the right slides', () => {
    renderHome()

    expect(screen.getByRole('link', { name: 'Start a project' })).toHaveAttribute('href', '#contact')
    expect(screen.getByRole('link', { name: 'Tell us your idea' })).toHaveAttribute('href', '#contact')
    expect(screen.getByRole('link', { name: 'See what we do' })).toHaveAttribute('href', '#services')
  })
})
