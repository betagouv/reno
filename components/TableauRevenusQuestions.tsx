'use client'
import styled from 'styled-components'

import { PersonnesQuestion } from '@/app/module/AmpleurQuestions'
import useSetSearchParams from './useSetSearchParams'
import { encodeSituation } from './publicodes/situationUtils'
import rules from '@/app/règles/rules'

export default function Questions() {
  const setSearchParams = useSetSearchParams()
  return (
    <Wrapper>
      <PersonnesQuestion
        {...{
          dot: false,
          text: 'Pour un ménage de',
          defaultSituation: {},
          situation: {},
          onChange: (dottedName) => (e) =>
            setSearchParams(encodeSituation({ [dottedName]: e.target.value })),
          answeredQuestions: [],
        }}
      />
      <p>{rules['ménage . personnes'].description}</p>
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
