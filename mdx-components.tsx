import Image from 'next/image'

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

export function useMDXComponents(components) {
  return {
    img: ({ src, alt }) => {
      const computedSrc = src.startsWith('/') ? src : '/blog-images/' + src
      return <Image src={computedSrc} alt={alt} />
    },
    ...components,
  }
}
