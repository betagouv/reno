'use client'

import {
  IdFQuestion,
  PeriodeConstructionQuestion,
  PersonnesQuestion,
  RevenuMaxQuestion,
  TypeResidence,
  TypeTravaux,
} from '@/app/module/AmpleurQuestions'
import rules from '@/app/règles/rules'
import rulesInteretEmprunt from '@/app/règles/intérêt-emprunt.publicodes'
import Publicodes from 'publicodes'
import { EligibilityResult } from '@/components/EligibilityResult'
import useSetSearchParams from '@/components/useSetSearchParams'
import {
  encodeDottedName,
  getAnsweredQuestions,
  getSituation,
} from '../publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'
import { ModuleWrapper } from '@/app/module/ModuleWrapper'
import { push } from '@socialgouv/matomo-next'
import { useEffect } from 'react'
import { useMediaQuery } from 'usehooks-ts'

export default function EligibilityPAR({ dottedName }) {
  const isMobile = useMediaQuery('(max-width: 400px)')
  useEffect(() => {
    push(['trackEvent', 'Module', 'Page', 'Module PAR'])
  }, [])
  const rulesWithInterets = {
    ...rules,
    ...rulesInteretEmprunt,
  }
  const engine = new Publicodes(rulesWithInterets)
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const situation = getSituation(searchParams, rulesWithInterets)

  const answeredQuestions = getAnsweredQuestions(
    searchParams,
    rulesWithInterets,
  )
  const onChange =
    (dottedName) =>
    ({ target: { value } }) =>
      setSearchParams({
        [encodeDottedName(dottedName)]: value + '*',
      })
  return (
    <ModuleWrapper isMobile={isMobile} title="Êtes-vous éligible au PAR+ ?">
      <form id="form-par">
        <TypeResidence {...{ setSearchParams, situation, answeredQuestions }} />
        <PeriodeConstructionQuestion
          {...{
            setSearchParams,
            situation,
            answeredQuestions,
            periode: 'au moins 2 ans',
            disabled: !answeredQuestions.includes(
              'logement . résidence principale propriétaire',
            ),
          }}
        />
        <IdFQuestion
          {...{
            setSearchParams,
            situation,
            answeredQuestions,
            disabled: !answeredQuestions.includes('logement . au moins 2 ans'),
          }}
        />
        <PersonnesQuestion
          {...{
            onChange,
            answeredQuestions,
            situation,
            disabled:
              !answeredQuestions.includes('ménage . région . IdF') &&
              !answeredQuestions.includes('logement . région . IdF'),
          }}
        />
        <RevenuMaxQuestion
          {...{
            engine,
            onChange,
            answeredQuestions,
            situation,
            setSearchParams,
            disabled: !answeredQuestions.includes('ménage . personnes'),
          }}
        />
        <TypeTravaux
          {...{
            setSearchParams,
            situation,
            rules,
            disabled: !answeredQuestions.includes('ménage . revenu . classe'),
          }}
        />
      </form>
      <EligibilityResult
        {...{
          engine,
          dottedName,
          situation,
          text: 'au PAR+',
        }}
      />
    </ModuleWrapper>
  )
}
