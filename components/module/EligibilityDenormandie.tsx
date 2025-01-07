'use client'

import {
  CommuneLogement,
  DureeLocation,
  Li,
  MontantQuestion,
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

export default function EligibilityDenormandie({ dottedName }) {
  const engine = new Publicodes(rules)
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const situation = getSituation(searchParams, rules)

  const answeredQuestions = getAnsweredQuestions(searchParams, rules)
  const evaluation = engine
    .setSituation(situation)
    .evaluate(dottedName + ' . montant')

  return (
    <>
      <h3
        css={`
          margin-top: 1rem;
        `}
      >
        Etes-vous éligible au dispositif Denormandie ?
      </h3>
      <QuestionList>
        <Li
          $next={true}
          $touched={answeredQuestions.includes(
            'denormandie . commune . éligible',
          )}
        >
          <CommuneLogement
            {...{
              setSearchParams,
              situation,
              answeredQuestions,
              onChange: (result) => {
                setSearchParams({
                  [encodeDottedName('logement . commune . denormandie')]:
                    result.eligibilite['logement . commune . denormandie'] +
                    '*',
                  [encodeDottedName('logement . commune')]: `"${result.code}"*`,
                  [encodeDottedName('logement . commune . nom')]:
                    `"${result.nom}"*`,
                })
              },
            }}
          />
        </Li>
        {situation['logement . commune . denormandie'] == 'oui' && (
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
              $touched={answeredQuestions.includes("logement . prix d'achat")}
            >
              <MontantQuestion
                {...{
                  setSearchParams,
                  situation,
                  answeredQuestions,
                  rule: "logement . prix d'achat",
                  text: "Le prix d'achat du logement est de",
                }}
              />
            </Li>
            <Li
              $next={answeredQuestions.includes("logement . prix d'achat")}
              $touched={answeredQuestions.includes('projet . travaux')}
            >
              <MontantQuestion
                {...{
                  setSearchParams,
                  situation,
                  answeredQuestions,
                  rule: 'projet . travaux',
                  text: 'Le budget travaux est estimé à',
                }}
              />
            </Li>
            <Li
              $next={answeredQuestions.includes('projet . travaux')}
              $touched={answeredQuestions.includes(
                'denormandie . années de location',
              )}
            >
              <DureeLocation
                {...{
                  setSearchParams,
                  situation,
                  rules,
                  answeredQuestions,
                  rule: 'denormandie . années de location',
                }}
              />
            </Li>
            <Li
              $next={answeredQuestions.includes(
                'denormandie . années de location',
              )}
              $touched={answeredQuestions.includes(
                'denormandie . gain énergétique minimum',
              )}
            >
              <YesNoQuestion
                {...{
                  setSearchParams,
                  situation,
                  answeredQuestions,
                  rules,
                  rule: 'denormandie . gain énergétique minimum',
                  text: "Allez-vous améliorer la performance énergétique d'au moins 30%?",
                }}
              />
            </Li>
            {situation['denormandie . gain énergétique minimum'] == 'non' && (
              <Li
                $next={answeredQuestions.includes(
                  'denormandie . gain énergétique minimum',
                )}
                $touched={answeredQuestions.includes(
                  'denormandie . gestes minimum',
                )}
              >
                <YesNoQuestion
                  {...{
                    setSearchParams,
                    situation,
                    answeredQuestions,
                    rules,
                    rule: 'denormandie . gestes minimum',
                    text: "Allez-vous réaliser 2 types de travaux parmi: changement de chaudière, de production d'eau chaude, isolation thermique des combles, des murs ou des fenêtres?",
                  }}
                />
              </Li>
            )}
          </>
        )}
      </QuestionList>
      <EligibilityResult
        {...{
          evaluation,
          engine,
          dottedName,
          situation,
          text: 'au dispositif Denormandie',
        }}
      />
    </>
  )
}
