'use client'
import MarSearch from '@/app/trouver-accompagnateur-renov/MarSearch'
import Image from 'next/image'
import { useState } from 'react'
import { CTA, CTAWrapper } from './UI'

//TODO this component should be turned into a <details tag, like AideAmpleur's CTA
export default function MapBehindCTA({
  link,
  what,
  codeInsee,
  text,
  importance,
}) {
  const [showMap, setShowMap] = useState(false)
  return (
    <section>
      <CTAWrapper $justify="left">
        <CTA $importance={importance}>
          <button onClick={() => setShowMap(!showMap)}>
            <span
              css={`
                display: flex;
                align-items: center;
                padding: 0.6rem 0;
                img {
                  filter: invert(1);
                  width: 1.8rem;
                  margin-right: 0.6rem;
                  height: auto;
                  vertical-align: bottom;
                }
                color: inherit;
                ${importance === 'emptyBackground' && `font-size: 90%`}
              `}
            >
              {false && (
                <Image
                  src="/hexagone-contour.svg"
                  width="10"
                  height="10"
                  alt="Icône coche pleine"
                />
              )}
              {text}
            </span>
          </button>
        </CTA>
      </CTAWrapper>

      <div
        css={`
          display: ${!showMap ? 'none' : 'block'};
        `}
      >
        <MarSearch codeInsee={codeInsee} what={what} />
      </div>
    </section>
  )
}
