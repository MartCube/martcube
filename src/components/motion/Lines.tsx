import { Fragment, type ReactNode } from 'react'

// Headline lines, each in its own mask so the reveal can slide it up from below.
// The space between lines keeps the heading's text reading "line one line two".
export function Lines({ lines }: { lines: ReactNode[] }) {
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && ' '}
      <span className="-mb-[0.08em] block overflow-hidden pb-[0.08em]">
        <span data-reveal="line" className="block">{line}</span>
      </span>
    </Fragment>
  ))
}
