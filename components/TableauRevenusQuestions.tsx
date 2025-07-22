'use client'
import styled from 'styled-components'

import { PersonnesQuestion } from '@/app/module/AmpleurQuestions'
import useSetSearchParams from './useSetSearchParams'
import { encodeSituation } from './publicodes/situationUtils'

export default function Questions() {
  const setSearchParams = useSetSearchParams()
  return (
    <>
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
    </>
  )
}
