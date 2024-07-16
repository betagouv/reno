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
  '/locales',
  '/interdiction-location',
  '/integration',
  '/module',
]

const documentationPaths = Object.keys(rules)
  .filter((dottedName) => !dottedName.startsWith('aides locales'))
  .map((dottedName) => '/documentation/' + dottedName)

const aidesLocales = Object.keys(rules)
  .filter(
    (dottedName) =>
      dottedName.startsWith('aides locales') &&
      dottedName.split(' . ').length === 2,
  )
  .map((dottedName) => `/locales/${dottedName.replace('aides locales . ', '')}`)

const paths = [...basePaths, ...documentationPaths, ...aidesLocales]

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: 'https://mesaidesreno.beta.gouv.fr' + path,
    lastModified: new Date(),
    changeFrequency: 'weekly',
  }))
}
