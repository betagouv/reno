// contentlayer.config.ts
import { defineDocumentType, makeSource } from 'contentlayer2/source-files'
import mdxOptions from './mdxOptions.mjs'

export const Article = defineDocumentType(() => ({
  name: 'Article',
  filePathPattern: `**/*.mdx`,
  contentType: 'mdx',

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
  computedFields: {
    url: {
      type: 'string',
      resolve: (post) => `/blog/${post._raw.flattenedPath}`,
    },
  },
}))

export default makeSource({
  contentDirPath: 'articles',
  documentTypes: [Article],
  mdx: mdxOptions,
})
