import Image from 'next/image'

type LogoProps = {
  className?: string
}

// The logo SVG keeps its own 387:80 aspect ratio; size it with a width class.
export function Logo({ className }: LogoProps) {
  return (
    <Image
      src="/brand/martcube-logo.svg"
      alt="MartCube"
      width={387}
      height={80}
      priority
      unoptimized
      className={className}
    />
  )
}
