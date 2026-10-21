import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { uiSlice } from './uiSlice'

// New slices plug in here (blog filters, brief builder, ...).
const rootReducer = combineSlices(uiSlice)

// A factory, not a singleton: on the server each request must get its own store.
export function makeStore() {
  return configureStore({ reducer: rootReducer })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = AppStore['dispatch']
