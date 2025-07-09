import { mdxComponents } from './mdxComponents'

import { MDXRemote } from 'next-mdx-remote-client/rsc'

import ExampleIframe from '@/app/module/ExampleIframe.tsx'
import CoproCTA from '@/components/CoproCTA'
import InterdictionTable from '@/components/InterdictionTable'
import HorizontalImages from '@/components/HorizontalImages'
import { CardMosaic } from '@/components/DevenirPartenaire'
import { Card } from '@/components/UI'
import Link from 'next/link'

export default function ArticleContent({ post }) {
  const { source, slug } = post

  return (
    <MDXRemote
      source={source}
      components={{
        ...mdxComponents,
        CoproCTA,
        CardMosaic,
        Card,
        Link,
        HorizontalImages,
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
