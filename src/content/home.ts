// All homepage text, one entry per slide. Moves to Sanity in phase 3.

export type Service = {
  id: string
  tab: string
  title: [string, string]
  body: string
  tags: string[]
}

export const hero = {
  eyebrow: 'Web & app studio · Remote',
  // The last word of the headline cycles through these.
  title: ['Websites', 'that'],
  words: ['move.', 'sell.', 'think.'],
  body: 'We design and build fast, animated websites, online stores and web apps that make your business impossible to scroll past.',
  primary: { label: 'Tell us your idea', href: '#contact' },
  secondary: { label: 'See what we do', href: '#services' },
} as const

export const services = {
  eyebrow: 'What we build',
  items: [
    {
      id: 'services-move',
      tab: 'Move',
      title: ['Websites', 'that move.'],
      body: 'Launch, landing and brand sites with custom motion and 3D that make people stop and look. Like this one.',
      tags: ['Product launches', 'Landing pages', 'Brand sites'],
    },
    {
      id: 'services-stores',
      tab: 'Stores',
      title: ['Online', 'stores.'],
      body: 'Storefronts that load fast and check out smoothly, with payments and shipping wired in.',
      tags: ['Payments', 'Shipping', 'Fast checkout'],
    },
    {
      id: 'services-editable',
      tab: 'Editable',
      title: ['Sites you', 'can edit.'],
      body: 'Change every page yourself in a friendly editor, in every language you sell in. No developer needed for a new headline.',
      tags: ['Easy editor', 'Multilingual', 'SEO ready'],
    },
    {
      id: 'services-apps',
      tab: 'Apps',
      title: ['From idea', 'to app.'],
      body: 'MVPs and web apps built end to end, including AI features your users will actually use.',
      tags: ['MVPs', 'Web apps', 'AI features'],
    },
  ] satisfies Service[],
}

export const contact = {
  title: ['Got an idea?', 'Say hi.'],
  body: 'A few lines about your project is all we need to start.',
  form: {
    name: { label: 'Name', placeholder: 'Your name' },
    email: { label: 'Email', placeholder: 'you@company.com' },
    need: {
      label: 'What do you need?',
      placeholder: 'Choose one (optional)',
      options: ['A website that moves', 'An online store', 'A site I can edit', 'An app or MVP', 'Not sure yet'],
    },
    message: { label: 'Message', placeholder: 'What are you building, and roughly when?' },
    submit: 'Send message',
    sending: 'Sending',
    failed: 'Something went wrong. Please try again.',
  },
  sent: {
    title: 'Message sent.',
    body: (name: string, email: string) => `Thanks, ${name}. We read every message and will get back to you at ${email} soon.`,
    again: 'Send another',
  },
} as const
