import { lastStop } from './stops'

// The one way UI code moves the page. The scroll engine registers how to scroll;
// buttons, links and keys call goTo / step without knowing which mode is active.
type ScrollTo = (stop: number) => void

let scrollTo: ScrollTo = () => {}
let current = 0

export const controller = {
  register(fn: ScrollTo) {
    scrollTo = fn
    return () => {
      if (scrollTo === fn) scrollTo = () => {}
    }
  },
  setCurrent(stop: number) {
    current = stop
  },
  get current() {
    return current
  },
  goTo(stop: number) {
    scrollTo(Math.min(lastStop, Math.max(0, stop)))
  },
  step(direction: 1 | -1) {
    this.goTo(current + direction)
  },
}
