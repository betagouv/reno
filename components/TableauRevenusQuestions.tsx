'use client'
import styled from 'styled-components'

import { PersonnesQuestion } from '@/app/module/AmpleurQuestions'
import useSetSearchParams from './useSetSearchParams'
import { encodeSituation } from './publicodes/situationUtils'

export default function Questions() {
  const setSearchParams = useSetSearchParams()
  return (
    <Wrapper>
      <PersonnesQuestion
        {...{
          text: 'Pour un ménage de',
          defaultSituation: {},
          situation: {},
          onChange: (dottedName) => (e) =>
            setSearchParams(encodeSituation({ [dottedName]: e.target.value })),
          answeredQuestions: [],
        }}
      />
      <p>
        Il s'agit des revenus fiscaux de référence des personnes composant votre
        ménage. Si ces dernières ont des avis d’imposition distincts, le montant
        à prendre en compte est la somme de leurs revenus.
      </p>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  img {
    width: 1.3rem;
    height: auto;
    vertical-align: sub;
    margin-right: 0.4rem;
  }
  margin-bottom: 1rem;
  > p {
    border-left: 4px solid var(--lighterColor);
    padding-left: 0.6rem;
    color: #333;
  }
`
