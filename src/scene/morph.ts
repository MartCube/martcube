// Where the page is between the six scenes, as one number from 0 to 5:
// 0 hero cube, 1 to 4 the four service panels, 5 the contact sphere.
// It matches the scroll stops, and moves smoothly between them.
export type PagePosition = {
  // Top of the services slide and of the contact slide, relative to the viewport.
  servicesTop: number
  contactTop: number
  // How many panels the services strip has moved sideways (0 to panels - 1).
  panel: number
  viewportHeight: number
}

export const SCENES = 6

export function morphProgress({ servicesTop, contactTop, panel, viewportHeight }: PagePosition): number {
  // A slide counts as "entered" as its top travels from the bottom of the screen to the top.
  const entered = (top: number) => Math.min(1, Math.max(0, 1 - top / viewportHeight))
  const panels = Math.min(SCENES - 3, Math.max(0, panel))
  return entered(servicesTop) + panels + entered(contactTop)
}
