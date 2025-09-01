'use client'

import {
  CommuneLogement,
  DureeLocation,
  MontantQuestion,
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
import { push } from '@socialgouv/matomo-next'
import { useEffect } from 'react'

export default function EligibilityDenormandie({ dottedName }) {
  useEffect(() => {
    push(['trackEvent', 'Module', 'Page', 'Module Denormandie'])
  }, [])
  const engine = new Publicodes(rules)
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const situation = getSituation(searchParams, rules)

  const answeredQuestions = getAnsweredQuestions(searchParams, rules)

  return (
    <ModuleWrapper title="Êtes-vous éligible au dispositif Denormandie ?">
      <form id="form-denormandie">
        <CommuneLogement
          {...{
            situation,
            onChange: (result) => {
              setSearchParams({
                [encodeDottedName('logement . commune . denormandie')]:
                  result.eligibilite['logement . commune . denormandie'] + '*',
                [encodeDottedName('logement . commune')]: `"${result.code}"*`,
                [encodeDottedName('logement . commune . nom')]:
                  `"${result.nom}"*`,
              })
            },
          }}
        />
        {situation['logement . commune . denormandie'] == 'oui' && (
          <>
            <TypeResidence
              {...{ setSearchParams, situation, answeredQuestions }}
            />
            <MontantQuestion
              {...{
                setSearchParams,
                situation,
                answeredQuestions,
                rule: "logement . prix d'achat",
                text: "Le prix d'achat du logement est de",
                disabled: !answeredQuestions.includes(
                  'logement . résidence principale propriétaire',
                ),
              }}
            />
            <MontantQuestion
              {...{
                setSearchParams,
                situation,
                answeredQuestions,
                rule: 'projet . travaux',
                text: 'Le budget travaux est estimé à',
                disabled: !answeredQuestions.includes(
                  "logement . prix d'achat",
                ),
              }}
            />
            <DureeLocation
              {...{
                setSearchParams,
                situation,
                rules,
                answeredQuestions,
                rule: 'denormandie . années de location',
                disabled: !answeredQuestions.includes('projet . travaux'),
              }}
            />
            <YesNoQuestion
              {...{
                setSearchParams,
                situation,
                answeredQuestions,
                rules,
                rule: 'denormandie . gain énergétique minimum',
                text: "Allez-vous améliorer la performance énergétique d'au moins 30%?",
                disabled: !answeredQuestions.includes(
                  'denormandie . années de location',
                ),
              }}
            />
            {situation['denormandie . gain énergétique minimum'] == 'non' && (
              <YesNoQuestion
                {...{
                  setSearchParams,
                  situation,
                  answeredQuestions,
                  rules,
                  rule: 'denormandie . gestes minimum',
                  text: "Allez-vous réaliser 2 types de travaux parmi: changement de chaudière, de production d'eau chaude, isolation thermique des combles, des murs ou des fenêtres?",
                  disabled: !answeredQuestions.includes(
                    'denormandie . gain énergétique minimum',
                  ),
                }}
              />
            )}
          </>
        )}
      </form>
      <EligibilityResult
        {...{
          engine,
          dottedName,
          situation,
          text: 'au dispositif Denormandie',
        }}
      />
    </ModuleWrapper>
  )
}
