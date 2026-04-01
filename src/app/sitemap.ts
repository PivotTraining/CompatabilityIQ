import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://compatibleiq.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://compatibleiq.com/login', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://compatibleiq.com/signup', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://compatibleiq.com/terms', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://compatibleiq.com/privacy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
}
