import type { MetadataRoute } from 'next'
import rules from '@/app/règles/rules.tsx'
import generateBlogSitemap from '@/blogSitemap'

export const domain = 'https://mesaidesreno.beta.gouv.fr'
const basePaths = [
  '',
  '/simulation',
  '/a-propos',
  '/faq',
  '/api-doc',
  '/personas',
  '/confidentialite',
  '/locales',
  '/cee',
  '/mpr',
  '/interdiction-location',
  '/integration',
  '/module',
  '/blog',
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

const simulateurCEE = Object.keys(rules)
  .filter((dottedName) => dottedName.startsWith('gestes') && dottedName.endsWith('CEE'))
  .map((dottedName) => `/cee/${rules[dottedName].code}/${encodeURIComponent(rules[dottedName].titre)}`)

const simulateurMPR = Object.keys(rules)
  .filter((dottedName) => dottedName.startsWith('gestes') && dottedName.endsWith('MPR'))
  .map((dottedName) => dottedName.replace(" . MPR", ""))
  .map((dottedName) => `/ma-prime-renov/${encodeURIComponent(rules[dottedName].titre)}`)

const paths = [
  ...basePaths,
  ...documentationPaths,
  ...aidesLocales,
  ...[...new Set(simulateurCEE)], // pour éviter les doublons
  ...[...new Set(simulateurMPR)] // pour éviter les doublons
]

export default async function sitemap(): MetadataRoute.Sitemap {
  const blogSitemap = await generateBlogSitemap()
  console.log(blogSitemap)
  return [
    ...paths.map((path) => ({
      url: domain + path,
    })),
    ...blogSitemap,
  ]
}
