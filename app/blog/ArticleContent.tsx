'use client'
//import { useMDXComponent } from 'next-contentlayer2/hooks'
//import { mdxComponents } from './mdxComponents'
//
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'

//import { MDXRemote } from 'next-mdx-remote/rsc'

export default async function ArticleContent({ post }) {
  //  const MDXContent = useMDXComponent(post.body.code)
  // return <MDXContent components={mdxComponents} />

  const { source, slug } = post

  console.log('cyan', slug, source)
  return <MDXRemote {...post.serialized} />
  //return <MDXRemote source={`# salut`}  />
}
