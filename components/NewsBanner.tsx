'use client'
import Link from 'next/link'
import { NewsBannerWrapper, YellowCard } from './NewsBannerUI'
import { motion } from 'framer-motion'
import Image from 'next/image'
import crossIcon from '@/public/remix-close-empty.svg'
import { useState } from 'react'
import { Card } from './UI'
import checkIcon from '@/public/check-green.svg'

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
        <p>
          <Image
            src={checkIcon}
            width="30"
            alt="Icône case cochée"
            css={`
              vertical-align: sub;
              width: 1rem;
              height: auto;
              margin-right: 0.2rem;
              filter: grayscale(1);
              display: none;
            `}
          />
          <small>Vous utilisez la version 2025. </small>
        </p>
        <YellowCard>
          <Link href="/blog/aides-renovation-2025">
            <span>💫</span>
            <p>
              Quels changements <br /> au 1er janvier 2025 ?
            </p>
          </Link>
        </YellowCard>
        <p>
          <small>
            <a href="https://2024.mesaidesreno.beta.gouv.fr" target="_blank">
              Revenir à la version 2024
            </a>
          </small>
        </p>
        <Image
          src={crossIcon}
          alt="Icône d'une croix"
          css={`
            filter: grayscale(1);
            width: 1.4rem;
            height: auto;
            position: absolute;
            top: 1rem;
            right: 0.9rem;
            cursor: pointer;
            background: white;
            z-index: 10;
          `}
          onClick={() => {
            setClosed(true)
          }}
        />
      </NewsBannerWrapper>
    </motion.div>
  )
}
