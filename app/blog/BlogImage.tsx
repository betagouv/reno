'use client'

import illustrationBlog from '@/public/illustration-blog.svg'
import illustrationMobile from '@/public/chat.svg'
import Image from 'next/image'
import { useMediaQuery } from 'usehooks-ts'
import css from '@/components/css/convertToJs'
import { useState } from 'react'

export default function BlogImage() {
  const isMobile = useMediaQuery('(max-width: 800px)', {
    initializeWithValue: false,
  })

  const [color, setColor] = useState(true)

  const alt = !isMobile
    ? 'Une personne consulte confortablement sur sa tablette un blog sur les aides à la rénovation énergétique'
    : 'Un chat tranquille sur un sol au bon confort thermique'

  const mobileStyle = `display: block; width: 4rem; height: auto; position: absolute;top:10rem; right: 0; cursor: pointer`

  return (
    <Image
      src={!isMobile ? illustrationBlog : illustrationMobile}
      style={{
        margin: '.6rem 3rem',
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
