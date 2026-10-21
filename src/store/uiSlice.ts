import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

// Where the visitor is on the homepage. Written by the scroll engine,
// read by the HUD, the service tabs and (from task 5) the particle scene.
export type UiState = {
  slide: number
  service: number
  progress: number
}

const initialState: UiState = { slide: 0, service: 0, progress: 0 }

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
  },
  selectors: {
    selectSlide: state => state.slide,
    selectService: state => state.service,
    selectProgress: state => state.progress,
  },
})

export const { positionChanged, progressChanged } = uiSlice.actions
export const { selectSlide, selectService, selectProgress } = uiSlice.selectors
