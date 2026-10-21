import { describe, expect, it } from 'vitest'
import { morphProgress } from './morph'

describe('morphProgress', () => {
  const vh = 800

  it('is 0 on the hero', () => {
    expect(morphProgress(800, 1600, vh)).toBe(0)
  })

  it('is halfway through the first morph when services is half in', () => {
    expect(morphProgress(400, 1200, vh)).toBe(0.5)
  })

  it('stays at 1 while services is pinned', () => {
    expect(morphProgress(0, 2400, vh)).toBe(1)
  })

  it('reaches 2 when contact is at the top', () => {
    expect(morphProgress(-800, 0, vh)).toBe(2)
  })
})
