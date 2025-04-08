'use client'

import illustrationBlog from '@/public/illustration-blog.svg'
import illustrationMobile from '@/public/chat.svg'
import Image from 'next/image'
import { useMediaQuery } from 'usehooks-ts'
import css from '@/components/css/convertToJs'

export default function BlogImage() {
  const isMobile = useMediaQuery('(max-width: 800px)', {
    initializeWithValue: false,
  })

  const alt = !isMobile
    ? 'Une personne consulte confortablement sur sa tablette un blog sur les aides à la rénovation énergétique'
    : 'Un chat tranquille sur un sol au bon confort thermique'

  const mobileStyle = `display: block; width: 4rem; height: auto; position: absolute;top:10rem; right: 0`

  return (
    <Image
      style={{ margin: '.6rem 3rem' }}
      src={!isMobile ? illustrationBlog : illustrationMobile}
      style={isMobile ? css(mobileStyle) : ''}
      alt={alt}
    />
  )
}
