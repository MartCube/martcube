import { describe, expect, it } from 'vitest'
import { makeStore } from './store'
import { messageSent, movingChanged, positionChanged, progressChanged, sceneLoadingChanged, selectMoving, selectProgress, selectSceneLoading, selectSending, selectSent, selectService, selectSlide, sendingChanged } from './uiSlice'

describe('ui slice', () => {
  it('starts on the first slide', () => {
    const state = makeStore().getState()
    expect(selectSlide(state)).toBe(0)
    expect(selectService(state)).toBe(0)
    expect(selectProgress(state)).toBe(0)
  })

  it('tracks slide and service', () => {
    const store = makeStore()
    store.dispatch(positionChanged({ slide: 1, service: 2 }))
    expect(selectSlide(store.getState())).toBe(1)
    expect(selectService(store.getState())).toBe(2)
  })

  it('clamps progress to 0..1', () => {
    const store = makeStore()
    store.dispatch(progressChanged(1.4))
    expect(selectProgress(store.getState())).toBe(1)
    store.dispatch(progressChanged(-0.2))
    expect(selectProgress(store.getState())).toBe(0)
  })

  it('tracks whether a slide transition is playing', () => {
    const store = makeStore()
    expect(selectMoving(store.getState())).toBe(false)
    store.dispatch(movingChanged(true))
    expect(selectMoving(store.getState())).toBe(true)
  })

  it('tracks whether the particle scene is loading', () => {
    const store = makeStore()
    expect(selectSceneLoading(store.getState())).toBe(false)
    store.dispatch(sceneLoadingChanged(true))
    expect(selectSceneLoading(store.getState())).toBe(true)
  })

  it('tracks whether the contact form is sending', () => {
    const store = makeStore()
    expect(selectSending(store.getState())).toBe(false)
    store.dispatch(sendingChanged(true))
    expect(selectSending(store.getState())).toBe(true)
  })

  it('counts sent messages', () => {
    const store = makeStore()
    store.dispatch(messageSent())
    store.dispatch(messageSent())
    expect(selectSent(store.getState())).toBe(2)
  })
})
