'use client'

import {
  Li,
  QuestionList,
  TypeResidence,
  PeriodeConstructionQuestion,
  YesNoQuestion,
  TypeTravaux,
  CommuneLogement,
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

export default function EligibilityEcoPTZ({ dottedName }) {
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

  useEffect(() => {
    push(['trackEvent', 'Module', 'Page', 'Module Eco-PTZ'])
  }, [])
  return (
    <ModuleWrapper title="Êtes-vous éligible à l'éco-PTZ ?">
      <form id="form-eco-ptz">
        <CommuneLogement
          {...{
            situation,
            onChange: (result) => {
              setSearchParams({
                [encodeDottedName('logement . commune')]: `"${result.code}"*`,
                [encodeDottedName('logement . commune . nom')]:
                  `"${result.nom}"*`,
                [encodeDottedName('logement . code département')]:
                  `"${result.codeDepartement}"*`,
              })
            },
          }}
        />
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
        <YesNoQuestion
          {...{
            setSearchParams,
            situation,
            answeredQuestions,
            rules,
            rule: dottedName + ' . condition maprimerenov',
            text: "Sollicitez-vous également l'aide MaPrimeRénov' (parcours accompagné ou rénovation par geste)",
            disabled: !answeredQuestions.includes('logement . au moins 2 ans'),
          }}
        />
        {answeredQuestions.includes(dottedName + ' . condition maprimerenov') &&
          situation[dottedName + ' . condition maprimerenov'] == 'non' && (
            <TypeTravaux
              {...{
                setSearchParams,
                situation,
                rules,
                disabled: !answeredQuestions.includes(
                  dottedName + ' . condition maprimerenov',
                ),
              }}
            />
          )}
      </form>
      <EligibilityResult
        {...{
          engine,
          dottedName,
          situation,
          text: "à l'éco-PTZ",
        }}
      />
    </ModuleWrapper>
  )
}
