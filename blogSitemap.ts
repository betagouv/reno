import { generateFeed } from '@/lib/rss'
import { getLastEdit } from './app/blog/utils'
import { domain } from './app/sitemap'
import { getAllArticles } from './app/blog/articles'

export default async function generateBlogSitemap() {
  const articles = await getAllArticles()
  const sitemap = await Promise.all(
    articles.map(async (article) => {
      const lastEdit = await getLastEdit(article.slug)
      return {
        url: domain + article.url,
        lastModified: new Date(lastEdit), //TODO not sure of the format here
      }
    }),
  )

  return [
    {
      url: domain + '/blog/aides-renovation-2025',
      lastModified: new Date('2025-01-02'),
    },
    ...sitemap,
  ]
}

generateFeed()
