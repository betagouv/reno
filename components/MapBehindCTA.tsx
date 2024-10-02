'use client'
import MarSearch from '@/app/trouver-accompagnateur-renov/MarSearch'
import Image from 'next/image'
import { CTA, CTAWrapper } from './UI'
import useSetSearchParams from './useSetSearchParams'
import { push } from '@socialgouv/matomo-next'

//TODO this component should be turned into a <details tag, like AideAmpleur's CTA
// Appelé "Map" parce qu'on montrait les conseillers sur une carte, mais ça a été retiré temporairement pour se concentrer sur une première mise en prod plus simple, mais la carte marchait
export default function MapBehindCTA({
  link,
  what,
  situation,
  text,
  importance,
  searchParams,
}) {
  const clickedCta = searchParams.cta
  const setSearchParams = useSetSearchParams()
  const clickCta = () => {
    push(["trackEvent", "Simulateur Principal", "Clic", "trouver conseiller"])
    setSearchParams({
      cta:
        clickedCta == null
          ? 'cliqué'
          : clickedCta === 'cliqué'
            ? 'refermé'
            : 'cliqué',
    })
  }
    
  return (
    <section>
      <CTAWrapper $justify="left">
        <CTA $importance={importance}>
          <button onClick={clickCta}>
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
          display: ${clickedCta !== 'cliqué' ? 'none' : 'block'};
        `}
      >
        <MarSearch situation={situation} what={what} />
      </div>
    </section>
  )
}
