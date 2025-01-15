import type { MetadataRoute } from 'next'
import rules from '@/app/règles/rules'
import generateBlogSitemap from '@/blogSitemap'
import writePublicodesJson from '@/lib/writePublicodesJson'
import postBingIndexNow from '@/lib/postBingIndexNow'

writePublicodesJson()

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
  '/aides',
  '/aides/cee',
  '/aides/ma-prime-renov',
  '/aides/pret-taux-0',
  '/aides/pret-taux-0/eco-ptz',
  '/aides/pret-taux-0/pret-avance-renovation',
  '/aides/exoneration-fiscale',
  '/aides/exoneration-fiscale/taxe-fonciere',
  '/aides/exoneration-fiscale/denormandie',
  '/aides/coup-de-pouce',
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
  .filter(
    (dottedName) =>
      dottedName.startsWith('gestes') && dottedName.endsWith('CEE'),
  )
  .map(
    (dottedName) =>
      `/aides/cee/${rules[dottedName].code}/${encodeURIComponent(rules[dottedName].titre)}`,
  )

const simulateurMPR = Object.keys(rules)
  .filter(
    (dottedName) =>
      dottedName.startsWith('gestes') && dottedName.endsWith('MPR'),
  )
  .map((dottedName) => dottedName.replace(' . MPR', ''))
  .map(
    (dottedName) =>
      `/aides/ma-prime-renov/${encodeURIComponent(rules[dottedName].titre)}`,
  )

const simulateurCoupDePouce = Object.keys(rules)
  .filter(
    (dottedName) =>
      dottedName.startsWith('gestes') && dottedName.endsWith('Coup de pouce'),
  )
  .map((dottedName) => dottedName.replace(' . Coup de pouce', ''))
  .map(
    (dottedName) =>
      `/aides/coup-de-pouce/${encodeURIComponent(rules[dottedName].titre)}`,
  )

const paths = [
  ...basePaths,
  //...documentationPaths, // We're trying a version of the site where search engines don't see the documentation, to avoid duplicate content with our simulators and half-empty non optimized pages
  ...aidesLocales,
  ...[...new Set(simulateurCEE)], // pour éviter les doublons
  ...[...new Set(simulateurMPR)], // pour éviter les doublons
  ...[...new Set(simulateurCoupDePouce)], // pour éviter les doublons
]

export default async function sitemap(): MetadataRoute.Sitemap {
  const blogSitemap = await generateBlogSitemap()

  await postBingIndexNow(paths)

  return [
    ...paths.map((path) => ({
      url: domain + path,
    })),
    ...blogSitemap,
  ]
}
