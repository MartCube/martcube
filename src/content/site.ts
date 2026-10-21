// Site-wide text: name, metadata and header.
// Moves to Sanity in phase 3.
export const site = {
  name: 'MartCube',
  title: 'MartCube | Websites that move',
  description: 'MartCube is a web and app studio. We build websites that move, online stores, content-managed sites and apps.',
  // Netlify sets URL to the site's main address on every build; locally it falls back to localhost.
  url: process.env.URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  header: {
    cta: { label: 'Start a project', href: '#contact' },
  },
  notFound: {
    title: 'This page doesn’t exist.',
    body: 'It may have moved, or the link has a typo. The homepage has everything we do.',
    back: 'Back to the homepage',
  },
} as const
