import type { MetadataRoute } from 'next'
import { site } from '@/content/site'

// One page for now. Showcase projects and blog posts get added here in later phases.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, changeFrequency: 'monthly', priority: 1 }]
}
