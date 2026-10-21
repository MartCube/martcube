export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p data-reveal="item" className="mb-5 font-mono text-[11px] tracking-[0.14em] text-lime uppercase sm:mb-6 sm:text-[13px]">
      {children}
    </p>
  )
}
