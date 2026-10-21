import type { ComponentProps } from 'react'

type ButtonLinkProps = ComponentProps<'a'> & {
  variant?: 'primary' | 'ghost'
  size?: 'md' | 'sm'
}

const variants = {
  primary: 'bg-lime text-ink hover:bg-[#d8ff6a]',
  ghost: 'border border-line text-paper hover:border-paper/40',
}

const sizes = {
  md: 'px-7 py-4 text-base',
  sm: 'px-5 py-3 text-[15px]',
}

// A pill-shaped link styled as a button. In-page links use plain <a>, not next/link.
export function ButtonLink({ variant = 'primary', size = 'md', className = '', ...props }: ButtonLinkProps) {
  return (
    <a
      className={`inline-flex items-center rounded-full font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-paper ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  )
}
