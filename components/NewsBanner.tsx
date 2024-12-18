'use client'
import Link from 'next/link'
import { NewsBannerWrapper } from './NewsBannerUI'
import { motion } from 'framer-motion'
import Image from 'next/image'
import crossIcon from '@/public/remix-close-empty.svg'
import { useState } from 'react'

export default function NewsBanner() {
  const [closed, setClosed] = useState(false)
  if (closed) return null
  return (
    <motion.div
      role="alert"
      initial={{ y: -30, scale: 1, opacity: 0 }}
      animate={{ y: 0, scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 20,
      }}
    >
      <NewsBannerWrapper>
        <p>💫 Vous utilisez la version 2025. </p>
        <p>
          <Link href="/blog/aides-renovation-2025">En savoir plus</Link>
        </p>
        <Image
          src={crossIcon}
          alt="Icône d'une croix"
          css={`
            filter: grayscale(1);
            width: 1.4rem;
            height: auto;
            position: absolute;
            top: 0.05rem;
            right: 0.1rem;
            cursor: pointer;
          `}
          onClick={() => {
            setClosed(true)
          }}
        />
      </NewsBannerWrapper>
    </motion.div>
  )
}
