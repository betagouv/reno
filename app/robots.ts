import { MetadataRoute } from 'next'

const robots: MetadataRoute.Robots = () => {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://mesaidesreno.beta.gouv.fr/sitemap.xml',
  }
}

export default robots
