'use client'

import illustrationBlog from '@/public/illustration-blog.svg'
import illustrationMobile from '@/public/chat.svg'
import Image from 'next/image'
import css from '@/components/css/convertToJs'
import { useState } from 'react'
import useIsMobile from '@/components/useIsMobile'

export default function BlogImage() {
  const isMobile = useIsMobile()

  const [color, setColor] = useState(true)

  const alt = !isMobile
    ? 'Une personne consulte confortablement sur sa tablette un blog sur les aides à la rénovation énergétique'
    : 'Un chat tranquille sur un sol au bon confort thermique'

  const mobileStyle = `display: block; width: 4rem; height: auto; position: absolute;top:10rem; right: 0; cursor: pointer`

  return (
    <Image
      src={!isMobile ? illustrationBlog : illustrationMobile}
      style={{
        width: '100%',
        height: 'auto',
        ...(isMobile
          ? {
              ...css(mobileStyle),
              filter: color ? `hue-rotate(${color}deg)` : '',
            }
          : ''),
      }}
      alt={alt}
      onClick={() => setColor((color) => Math.random() * 180)}
    />
  )
}
