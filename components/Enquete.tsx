import Link from 'next/link'
import { CTA, CTAWrapper } from './UI'
import Script from 'next/script'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Enquete({}) {
  const [displayEnquete, setDisplayEnquete] = useState(false)
  return (
    <div
      css={`
        background: rgba(253, 219, 252, 0.7);
        border: 1px solid rgba(0, 0, 145, 0.4);
        border-radius: 5px;
        padding: 12px;
        margin-bottom: 1rem;
        > div {
          margin: 10px 0;
        }
      `}
    >
      👋 Rendez Mes Aides Réno <strong>encore plus utile</strong>. 7 questions
      en 1 minute pour mieux connaître vos attentes.
      <CTAWrapper $justify="left">
        <CTA $fontSize="normal">
          <span onClick={() => setDisplayEnquete(true)}>Je participe! ️⬇</span>
        </CTA>
      </CTAWrapper>
      {displayEnquete && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        >
          <iframe
            data-tally-src="https://tally.so/embed/nW1bYL?alignLeft=1&hideTitle=1&transparentBackground=0&dynamicHeight=1"
            width="100%"
            height="400px"
            title="Sondage"
          ></iframe>
          <Script
            id="tally-js"
            src="https://tally.so/widgets/embed.js"
            onLoad={() => {
              Tally.loadEmbeds()
            }}
          />
        </motion.div>
      )}
    </div>
  )
}
