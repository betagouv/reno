import { allArticles } from '@/.contentlayer/generated'
import { getLastEdit } from './app/blog/utils'
import { domain } from './app/sitemap'

export default async function generateBlogSitemap() {
  return Promise.all(
    allArticles.map(async (article) => {
      const lastEdit = await getLastEdit(article._raw.flattenedPath)
      return {
        url: domain + article.url,
        lastModified: new Date(lastEdit), //TODO not sure of the format here
      }
    }),
  )
}
