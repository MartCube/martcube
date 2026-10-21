import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Home from './page'

describe('Home', () => {
  it('shows the logo and the headline', () => {
    render(<Home />)

    expect(screen.getByRole('img', { name: 'MartCube' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Websites that move.')
  })
})
