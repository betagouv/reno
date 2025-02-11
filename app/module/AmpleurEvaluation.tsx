'use client'

import { AideSummary } from '@/components/ampleur/AideSummary'
import { filterAidesToDisplay } from '@/components/ampleur/AmpleurSummary'
import { useAides } from '@/components/ampleur/useAides'
import styled from 'styled-components'

export function EvaluationValue({ engine, situation, shouldDisplay }) {
  console.log('ampleur module situation', situation)

  engine.setSituation(situation)
  const aides = useAides(engine, situation)
  console.log('ampleur module aides', aides)
  const hasAides = aides.filter((aide) => aide.status === true).length > 0
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
      <div>
        <ol>
          {aidesToDisplay.slice(0, 3).map((aide) => {
            const text = aide.marque,
              text2 = aide['complément de marque']
            return (
              <li key={aide.dottedName}>
                <AideSummary
                  key={aide.dottedName}
                  {...{
                    ...aide,
                    icon: aide.icône,
                    text,
                    text2,
                    situation,
                    type: aide.type,
                    expanded: true,
                    display: 'ampleur-card',
                    engine,
                  }}
                />
              </li>
            )
          })}
        </ol>
      </div>
    </EvaluationValueWrapper>
  )
}
export const EvaluationValueWrapper = styled.section`
h2 {margin: 0 0 .6rem 0 }
  img {
    width: 1.6rem;
    height: auto;
    margin-right: 1rem;
  }
  margin: 1.6rem 0;
  @media (max-width: 400px) {
    margin: 0.8rem 0;
  }
  > div {
  display: flex;
  align-items: center;
  }
  min-width: 20rem;
  max-width: 85vw;
  background:  ${(p) => (p.$active ? 'var(--lightestColor)' : '#fdf8db')};
  border-bottom: 4px solid var(--color);

  padding: .8rem 1.6rem;
  @media (max-width: 400px){padding: .6rem 1rem;}
  small {
    margin-bottom: 0.4rem;
  }
  h4 {font-size: 100%; font-weight: normal: margin: 0}
  ol{padding: 0.2rem; list-style-type: circle; color: var(--color); details {color: black}}
`
