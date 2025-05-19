'use client'

import { filterAidesToDisplay } from '@/components/ampleur/AmpleurSummary'
import { useAides } from '@/components/ampleur/useAides'
import styled from 'styled-components'
import { AmpleurAideSummary } from './AmpleurAideSummary'
import AmpleurCTA from './AmpleurCTA'
import { CTA } from '@/components/UI'
import DPELabel from '@/components/dpe/DPELabel'

export function EvaluationValue({
  engine,
  situation,
  shouldDisplay,
  noDefaultSituation,
  currentDPE,
  targetDPE,
  disclaimer = true,
}) {
  console.log('ampleur module situation', situation)

  engine.setSituation(situation)
  const aides = useAides(engine, situation)
  console.log('ampleur module aides', aides)
  const aidesToDisplay = filterAidesToDisplay(aides)
  console.log({ aides, aidesToDisplay })

  if (!shouldDisplay)
    return (
      <EvaluationValueWrapper $active={shouldDisplay}>
        <h2>⏳️ En attente de résultats</h2>
        <div>
          <p>
            Répondez aux questions ci-dessus pour afficher vos aides
            💶&nbsp;&nbsp;💶
          </p>
        </div>
      </EvaluationValueWrapper>
    )
  return (
    <EvaluationValueWrapper $active={shouldDisplay}>
      <h2>🥳 Résultats</h2>
      <p>Vous êtes éligible à :</p>
      <div>
        <ol>
          {aidesToDisplay.slice(0, 3).map((aide) => {
            const text = aide.marque,
              text2 = aide['complément de marque']
            return (
              <li key={aide.dottedName}>
                <AmpleurAideSummary
                  key={aide.dottedName}
                  {...{
                    ...aide,
                    icon: aide.icône,
                    text,
                    text2,
                    situation,
                    type: aide.type,
                    expanded: true,
                    engine,
                  }}
                />
              </li>
            )
          })}
        </ol>
      </div>
      <CTA
        css={`
          margin-top: 1rem;
          margin-bottom: 1rem;
          a  {
            display: flex;
            font-size: 85% !important;
            align-items: center;
            img {
              height: 2rem;
              width: auto;
              margin-right: 0.6rem;
            }
          }
        `}
      >
        <AmpleurCTA {...{ situation: noDefaultSituation }} />
      </CTA>
      {disclaimer && (
        <p
          css={`
            line-height: 1.3rem;
          `}
        >
          <small>
            Pour bénéficier de ces aides d'ampleur, des gains énergétiques
            seront à réaliser, par exemple un saut d'au moins 2 classes de DPE,
            soit passer du DPE actuel <DPELabel index={currentDPE - 1} /> à un
            DPE <DPELabel index={targetDPE - 1} />.
          </small>
        </p>
      )}
    </EvaluationValueWrapper>
  )
}
export const EvaluationValueWrapper = styled.section`
h2 {margin: 0 0 .8rem 0 }
  img {
    width: 1.6rem;
    height: auto;
    margin-right: 1rem;
  }
  margin: 1.6rem 0 0 0;
  @media (max-width: 400px) {
    margin: 0.8rem 0;
  }
  > div {
  display: flex;
  align-items: center;
  }
  width: 100%;
  background:  ${(p) => (p.$active ? 'var(--lightestColor)' : '#fdf8db')};
  border-bottom: 4px solid var(--color);

  padding: .8rem 1.3rem;
  @media (max-width: 400px){padding: .6rem 1rem;}
  small {
    margin-bottom: 0.4rem;
  }
  h4 {font-size: 100%; font-weight: normal: margin: 0}
  ol{padding: 0.2rem; list-style-type: none; 
  li {

display: flex; justify-content: start; 
flex-wrap: wrap;
align-items: center;
margin-bottom: .3rem;
@media (max-width: 800px){margin-bottom: .5rem}

> h3 {
width: 17rem;
margin-bottom: 0;


}
  }}
`
