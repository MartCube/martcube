import { lastStop } from './stops'

// The one way UI code moves the deck. The deck engine registers how to move;
// buttons, links and keys call goTo / step without knowing how it's done.
type Move = (stop: number) => void
type Step = (direction: 1 | -1) => void

let move: Move = () => {}
let stepper: Step = () => {}
let current = 0

// Which particle shape is showing, shared with the scene every frame:
// it blends from shape `from` to shape `to` as `mix` runs 0 → 1.
export const sceneMotion = { from: 0, to: 0, mix: 1 }

export const controller = {
  register(goTo: Move, step: Step) {
    move = goTo
    stepper = step
    return () => {
      if (move === goTo) {
        move = () => {}
        stepper = () => {}
      }
    }
  },
  setCurrent(stop: number) {
    current = stop
  },
  get current() {
    return current
  },
  goTo(stop: number) {
    move(Math.min(lastStop, Math.max(0, stop)))
  },
  step(direction: 1 | -1) {
    stepper(direction)
  },
}
