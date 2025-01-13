'use client'

import {
  Li,
  QuestionList,
  TypeResidence,
  PeriodeConstructionQuestion,
  YesNoQuestion,
  TypeTravaux,
} from '@/app/module/AmpleurQuestions'
import rules from '@/app/règles/rules'
import rulesInteretEmprunt from '@/app/règles/intérêt-emprunt.publicodes'
import Publicodes from 'publicodes'
import { EligibilityResult } from '@/components/EligibilityResult'
import useSetSearchParams from '@/components/useSetSearchParams'
import {
  getAnsweredQuestions,
  getSituation,
} from '../publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'
import { EligibiliyTitle } from '../UI'
import { AmpleurWrapper } from '@/app/module/AmpleurUI'
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
    <AmpleurWrapper>
      <EligibiliyTitle>Êtes-vous éligible à l'éco-PTZ ?</EligibiliyTitle>
      <QuestionList>
        <Li
          $next={true}
          $touched={answeredQuestions.includes(
            'logement . résidence principale propriétaire',
          )}
        >
          <TypeResidence
            {...{ setSearchParams, situation, answeredQuestions }}
          />
        </Li>
        <Li
          $next={answeredQuestions.includes(
            'logement . résidence principale propriétaire',
          )}
          $touched={answeredQuestions.includes('logement . au moins 2 ans')}
        >
          <PeriodeConstructionQuestion
            {...{
              setSearchParams,
              situation,
              answeredQuestions,
              periode: 'au moins 2 ans',
            }}
          />
        </Li>
        <Li
          $next={answeredQuestions.includes('logement . au moins 2 ans')}
          $touched={answeredQuestions.includes(
            dottedName + ' . condition maprimerenov',
          )}
        >
          <YesNoQuestion
            {...{
              setSearchParams,
              situation,
              answeredQuestions,
              rules,
              rule: dottedName + ' . condition maprimerenov',
              text: "Sollicitez-vous également l'aide MaPrimeRénov' (parcours accompagné ou par geste)",
            }}
          />
        </Li>
        {answeredQuestions.includes(dottedName + ' . condition maprimerenov') &&
          situation[dottedName + ' . condition maprimerenov'] == 'non' && (
            <Li
              $next={answeredQuestions.includes(
                dottedName + ' . condition maprimerenov',
              )}
              $touched={answeredQuestions.includes('logement . type travaux')}
            >
              <TypeTravaux
                {...{
                  setSearchParams,
                  situation,
                  rules,
                }}
              />
            </Li>
          )}
      </QuestionList>
      <EligibilityResult
        {...{
          engine,
          dottedName,
          situation,
          text: "à l'éco-PTZ",
        }}
      />
    </AmpleurWrapper>
  )
}
