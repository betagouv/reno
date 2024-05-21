import type { MetadataRoute } from 'next'

const paths = [
  '',
  '/simulation',
  '/a-propos',
  '/faq',
  '/api-doc',
  '/personas',
  '/confidentialite',
]
export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: 'https://mesaidesreno.beta.gouv.fr' + path,
    lastModified: new Date(),
    changeFrequency: 'weekly',
  }))
}
