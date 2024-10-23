'use client'

import { AideSummary } from '@/components/ampleur/AideSummary'
import { filterAidesToDisplay } from '@/components/ampleur/AmpleurSummary'
import { useAides } from '@/components/ampleur/useAides'
import styled from 'styled-components'

export function EvaluationValue({ engine, situation }) {
  const aides = useAides(engine, situation)
  const hasAides = aides.filter((aide) => aide.status === true).length > 0
  const aidesToDisplay = filterAidesToDisplay(aides)
  console.log({ aides, aidesToDisplay })
  return (
    <EvaluationValueWrapper>
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
    </EvaluationValueWrapper>
  )
}
export const EvaluationValueWrapper = styled.div`
  img {
    width: 4rem;
    height: auto;
    margin-right: 1rem;
  }
  margin: 1.6rem auto;
  @media (max-width: 400px) {
    margin: 0.8rem 0;
  }
  display: flex;
  align-items: center;
  width: fit-content;
  background: var(--lightestColor);
  border-bottom: 4px solid var(--color);

  padding: 1rem 2rem;
  @media (max-width: 400px){padding: .6rem 1rem;}
  text-align: center;
  small {
    margin-bottom: 0.4rem;
  }
  h4 {font-size: 100%; font-weight: normal: margin: 0}
  ol{padding: 0.2rem; list-style-type: circle; color: var(--color); details {color: black}}
`
