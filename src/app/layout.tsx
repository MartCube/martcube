import type { Metadata, Viewport } from 'next'
import { DM_Sans, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { site } from '@/content/site'
import { StoreProvider } from '@/store/StoreProvider'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: 'en',
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0b0f',
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}
