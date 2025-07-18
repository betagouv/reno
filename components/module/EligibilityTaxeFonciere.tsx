'use client'

import {
  CommuneLogement,
  PeriodeConstructionQuestion,
  TypeResidence,
  YesNoQuestion,
} from '@/app/module/AmpleurQuestions'
import rules from '@/app/règles/rules'
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
import { useEffect } from 'react'
import { push } from '@socialgouv/matomo-next'
import { useMediaQuery } from 'usehooks-ts'

export default function EligibilityTaxeFonciere({ dottedName }) {
  const isMobile = useMediaQuery('(max-width: 400px)')
  useEffect(() => {
    push(['trackEvent', 'Module', 'Page', 'Module Taxe fonciere'])
  }, [])

  const engine = new Publicodes(rules)
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const situation = getSituation(searchParams, rules)

  const answeredQuestions = getAnsweredQuestions(searchParams, rules)
  const evaluation = engine
    .setSituation(situation)
    .evaluate(dottedName + ' . conditions')

  return (
    <ModuleWrapper
      isMobile={isMobile}
      title="Êtes-vous éligible à l'exonération de Taxe Foncière ?"
    >
      <form id="form-taxe-fonciere">
        <CommuneLogement
          {...{
            situation,
            onChange: (result) => {
              setSearchParams({
                [encodeDottedName('logement . commune')]: `"${result.code}"*`,
                [encodeDottedName('logement . commune . nom')]:
                  `"${result.nom}"*`,
                [encodeDottedName('taxe foncière . commune . éligible')]:
                  result.eligibilite['taxe foncière . commune . éligible'] +
                  '*',
                ...(result.eligibilite['taxe foncière . commune . taux']
                  ? {
                      [encodeDottedName('taxe foncière . commune . taux')]:
                        result.eligibilite['taxe foncière . commune . taux'] +
                        '*',
                    }
                  : {}),
              })
            },
          }}
        />
        {situation['taxe foncière . commune . éligible'] == 'oui' && (
          <>
            <TypeResidence
              {...{ setSearchParams, situation, answeredQuestions }}
            />
            <PeriodeConstructionQuestion
              {...{
                setSearchParams,
                situation,
                answeredQuestions,
                periode: 'au moins 10 ans',
                disabled: !answeredQuestions.includes(
                  'logement . résidence principale propriétaire',
                ),
              }}
            />
            <YesNoQuestion
              {...{
                setSearchParams,
                situation,
                answeredQuestions,
                rules,
                rule: 'taxe foncière . condition de dépenses',
                disabled: !answeredQuestions.includes(
                  'logement . au moins 10 ans',
                ),
              }}
            />
          </>
        )}
      </form>
      <EligibilityResult
        {...{
          evaluation,
          engine,
          dottedName,
          situation,
          text: "à l'exonération de taxe foncière",
        }}
      />
    </ModuleWrapper>
  )
}
