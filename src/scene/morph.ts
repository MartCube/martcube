// How far the page has moved between the three scenes, from 0 (cube) through
// 1 (services wave) to 2 (contact sphere). Each step fills in as the next
// slide's top travels from the bottom of the screen to the top.
export function morphProgress(servicesTop: number, contactTop: number, viewportHeight: number): number {
  const entered = (top: number) => Math.min(1, Math.max(0, 1 - top / viewportHeight))
  return entered(servicesTop) + entered(contactTop)
}
