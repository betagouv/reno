import { mdxComponents } from './mdxComponents'

import { MDXRemote } from 'next-mdx-remote-client/rsc'

import ExampleIframe from '@/app/module/ExampleIframe.tsx'
import CoproCTA from '@/components/CoproCTA'
import InterdictionTable from '@/components/InterdictionTable'

export default function ArticleContent({ post }) {
  const { source, slug } = post

  return (
    <MDXRemote
      source={source}
      components={{
        ...mdxComponents,
        CoproCTA,
        InterdictionTable,
        ExampleIframe,
      }}
      options={{
        parseFrontmatter: true,
        mdxOptions: {
          baseUrl: import.meta.url,
        },
      }}
    />
  )
}
