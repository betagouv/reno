import type { MetadataRoute } from 'next'
import rules from '@/app/règles/rules.tsx'

const basePaths = [
  '',
  '/simulation',
  '/a-propos',
  '/faq',
  '/api-doc',
  '/personas',
  '/confidentialite',
]

const documentationPaths = Object.keys(rules).map(
  (dottedName) => '/documentation/' + dottedName,
)

const paths = [...basePaths, ...documentationPaths]

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: 'https://mesaidesreno.beta.gouv.fr' + path,
    lastModified: new Date(),
    changeFrequency: 'weekly',
  }))
}
