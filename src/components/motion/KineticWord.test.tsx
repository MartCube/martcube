import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StoreProvider } from '@/store/StoreProvider'
import { KineticWord } from './KineticWord'

describe('KineticWord', () => {
  it('starts on the first word and keeps the letters away from screen readers', () => {
    render(
      <h1>
        that
        {' '}
        <KineticWord words={['move.', 'sell.']} />
      </h1>,
      { wrapper: StoreProvider },
    )

    expect(screen.getByRole('heading')).toHaveAccessibleName('that move.')
    const letters = screen.getByTestId('kinetic-word')
    expect(letters).toHaveTextContent('move.')
    expect(letters.children).toHaveLength(5)
    expect(letters.parentElement).toHaveAttribute('aria-hidden', 'true')
  })
})
