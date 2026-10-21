import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

// Where the visitor is on the homepage. Written by the deck engine,
// read by the HUD, the service tabs, the header loader and the particle scene.
export type UiState = {
  slide: number
  service: number
  progress: number
  // True while a slide transition plays. Input is locked and the header loader spins.
  moving: boolean
  // Counts sent messages, so the scene can react to each new one with a burst.
  sent: number
}

const initialState: UiState = { slide: 0, service: 0, progress: 0, moving: false, sent: 0 }

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    positionChanged(state, action: PayloadAction<{ slide: number, service: number }>) {
      state.slide = action.payload.slide
      state.service = action.payload.service
    },
    progressChanged(state, action: PayloadAction<number>) {
      state.progress = Math.min(1, Math.max(0, action.payload))
    },
    movingChanged(state, action: PayloadAction<boolean>) {
      state.moving = action.payload
    },
    messageSent(state) {
      state.sent += 1
    },
  },
  selectors: {
    selectSlide: state => state.slide,
    selectService: state => state.service,
    selectProgress: state => state.progress,
    selectMoving: state => state.moving,
    selectSent: state => state.sent,
  },
})

export const { positionChanged, progressChanged, movingChanged, messageSent } = uiSlice.actions
export const { selectSlide, selectService, selectProgress, selectMoving, selectSent } = uiSlice.selectors
