import { sortBy } from '@/components/utils'
import { article as article2025 } from '@/app/blog/aides-renovation-2025/page'
import { serialize } from 'next-mdx-remote-client/serialize'
import fs from 'fs'
import path from 'path'

/* This is the old specification created for contentlayer
  fields: {
    titre: { type: 'string', required: true },
    brouillon: { type: 'boolean', required: false },
    date: { type: 'date', required: true },
    description: { type: 'string', required: true },
    image: { type: 'string', required: false },
    'image verticale': { type: 'boolean', required: false },
    tags: { type: 'list', of: { type: 'string' }, required: false },
    cta: { type: 'string', required: false },
  },
  */

/* Warning : use this function in server components or build functions ! Else, use a generateStaticParams as in /blog/[slug].tsx */
export async function getAllArticles() {
  // get all MDX files
  const postFilePaths = fs.readdirSync('articles').filter((postFilePath) => {
    return path.extname(postFilePath).toLowerCase() === '.mdx'
  })

  const postPreviews: PostPreview[] = []

  // read the frontmatter for each file
  for (const postFilePath of postFilePaths) {
    const postFile = fs.readFileSync(`articles/${postFilePath}`, 'utf8')

    // serialize the MDX content to a React-compatible format
    // and parse the frontmatter
    const serializedPost = await serialize({
      source: postFile,
      options: { parseFrontmatter: true },
    })

    const slug = postFilePath.replace('.mdx', '')

    const url = `/blog/${slug}`
    postPreviews.push({
      ...serializedPost.frontmatter,
      // add the slug to the frontmatter info
      slug,
      url,
      source: postFile,
      serialized: serializedPost,
    } as PostPreview)
  }

  const articles = postPreviews

  const mdxArticles = articles.filter((article) => !article.brouillon)
  const sortedArticles = [
    ...sortBy((article) => article.date)([
      ...mdxArticles,
      article2025,
    ]).reverse(),
  ]

  return sortedArticles
}
