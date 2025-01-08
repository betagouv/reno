import { useMDXComponent } from 'next-contentlayer2/hooks'
import { mdxComponents } from './mdxComponents'
export default function ArticleContent({ post }) {
  const MDXContent = useMDXComponent(post.body.code)
  return <MDXContent components={mdxComponents} />
}
