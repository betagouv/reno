'use client'

import {
  CommuneLogement,
  Li,
  PeriodeConstructionQuestion,
  QuestionList,
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
      <QuestionList>
        <Li
          $next={true}
          $touched={answeredQuestions.includes(
            'taxe foncière . commune . éligible',
          )}
        >
          <CommuneLogement
            {...{
              setSearchParams,
              situation,
              answeredQuestions,
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
        </Li>
        {situation['taxe foncière . commune . éligible'] == 'oui' && (
          <>
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
              $touched={answeredQuestions.includes(
                'logement . au moins 10 ans',
              )}
            >
              <PeriodeConstructionQuestion
                {...{
                  setSearchParams,
                  situation,
                  answeredQuestions,
                  periode: 'au moins 10 ans',
                }}
              />
            </Li>
            <Li
              $next={answeredQuestions.includes('logement . au moins 10 ans')}
              $touched={answeredQuestions.includes(
                'taxe foncière . condition de dépenses',
              )}
            >
              <YesNoQuestion
                {...{
                  setSearchParams,
                  situation,
                  answeredQuestions,
                  rules,
                  rule: 'taxe foncière . condition de dépenses',
                }}
              />
            </Li>
          </>
        )}
      </QuestionList>
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
