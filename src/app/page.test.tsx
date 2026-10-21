import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { services } from '@/content/home'
import Home from './page'

describe('Home', () => {
  it('renders the three slides in order', () => {
    render(<Home />)

    const regions = screen.getAllByRole('region').map(r => r.getAttribute('aria-label'))
    expect(regions).toEqual(['Intro', 'Services', 'Contact'])
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Websites that move.')
  })

  it('shows one panel per service, each reachable from the tabs', () => {
    render(<Home />)

    const tabs = within(screen.getByRole('navigation', { name: 'Services' })).getAllByRole('link')
    expect(tabs).toHaveLength(services.items.length)
    for (const [i, item] of services.items.entries()) {
      expect(tabs[i]).toHaveAttribute('href', `#${item.id}`)
      expect(document.getElementById(item.id)).toBeInTheDocument()
    }
  })

  it('points the calls to action at the right slides', () => {
    render(<Home />)

    expect(screen.getByRole('link', { name: 'Start a project' })).toHaveAttribute('href', '#contact')
    expect(screen.getByRole('link', { name: 'Tell us your idea' })).toHaveAttribute('href', '#contact')
    expect(screen.getByRole('link', { name: 'See what we do' })).toHaveAttribute('href', '#services')
  })
})
