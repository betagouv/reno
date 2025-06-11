'use client'
import rules from '@/app/règles/rules'
import { createExampleSituation } from '@/components/ampleur/AmpleurSummary'
import useSyncAmpleurSituation from '@/components/ampleur/useSyncAmpleurSituation'
import { enrichSituationWithConstructionYear } from '@/components/personas/enrichSituation'
import useEnrichSituation from '@/components/personas/useEnrichSituation'
import {
  encodeDottedName,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import { useSearchParams } from 'next/navigation'
import Publicodes from 'publicodes'
import { useMemo } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { EvaluationValue } from './AmpleurEvaluation'
import { ampleurQuestionsAnswered, usageLogementValues } from './AmpleurInputs'
import {
  IdFQuestion,
  Li,
  PersonnesQuestion,
  QuestionList,
  RevenuQuestion,
  TypeResidence,
} from './AmpleurQuestions'
import { ModuleWrapper } from './ModuleWrapper'
import UserData from './UserData'
import AmpleurWidget from '@/components/ampleur/AmpleurWidget'

const engine = new Publicodes(rules)

export default function Ampleur({ type }) {
  const setSearchParams = useSetSearchParams()
  const isMobile = useMediaQuery('(max-width: 400px)')

  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  const { persona: selectedPersona = 0, ...situationSearchParams } =
    searchParams

  const rawUserSituation = getSituation(situationSearchParams, rules)

  const userSituation = useMemo(
    () => enrichSituationWithConstructionYear(rawUserSituation, engine),
    [rawUserSituation],
  )

  const answeredQuestionsFromUrl = getAnsweredQuestions(
    situationSearchParams,
    rules,
  )
  const answeredSituation = Object.fromEntries(
    answeredQuestionsFromUrl.map((dottedName) => [
      dottedName,
      userSituation[dottedName],
    ]),
  )

  console.log('cyan aq', answeredSituation)
  const savedSituation = useSyncAmpleurSituation(answeredSituation)
  console.log('cyan ss', savedSituation, userSituation)

  const answeredQuestions = savedSituation
    ? Object.keys(savedSituation)
    : answeredQuestionsFromUrl

  const currentDPE = +userSituation['DPE . actuel']
  const targetDPE =
    +userSituation['projet . DPE visé'] || Math.max(currentDPE - 2, 1)

  const extremeSituation = createExampleSituation({}, 'best')

  const defaultSituation = {
    ...extremeSituation, // pour déclencher Denormandie, taxe foncière, etc
    ...usageLogementValues[0].situation,
    'vous . propriétaire . condition': 'oui',
    'ménage . revenu': 25000, // Le revenu médian est de 20 000, mais le mettre à 25 000 permet de faire en sorte qu'il y ait une différence entre IdF et hors IdF pour que la case à cocher ait un effet
    'ménage . personnes': 2,
    'ménage . région . IdF': 'non',
  }

  const rawSituation = useMemo(
    () => ({
      ...defaultSituation,
      'projet . DPE visé': targetDPE,
      ...savedSituation,
      ...userSituation,
    }),
    [rawSearchParams.toString(), JSON.stringify(savedSituation)],
  )

  const enrichedSituation = useEnrichSituation(rawSituation)
  const situation = enrichedSituation || rawSituation

  const communeKey = 'logement . commune . nom'
  const commune = situation[communeKey]
  const noDefaultSituation = {
    ...savedSituation,
    ...userSituation,
    ...(commune ? { [communeKey]: commune } : {}),
  }

  if (!currentDPE || isNaN(currentDPE))
    return (
      <p>
        Un DPE est nécessaire pour estimer les aides à la rénovation d'ampleur.
      </p>
    )

  const onChange =
    (dottedName) =>
    ({ target: { value } }) =>
      setSearchParams({
        [encodeDottedName(dottedName)]: value + '*',
      })

  const shouldDisplay = ampleurQuestionsAnswered(answeredQuestions)

  return type == 'module' ? (
    <ModuleWrapper
      isMobile={isMobile}
      title="Vos aides pour une rénovation d'ampleur"
    >
      <p>
        L’État vous aide à financer votre rénovation énergétique : faites le
        calcul !
      </p>
      <QuestionList>
        <Li
          key="typeResidence"
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
          $touched={
            answeredQuestions.includes('ménage . région . IdF') ||
            answeredQuestions.includes('logement . région . IdF')
          }
          key="IdF"
        >
          <IdFQuestion
            {...{
              setSearchParams,
              isMobile,
              situation,
              answeredQuestions,
            }}
          />
        </Li>
        <Li
          key="personnes"
          $next={
            answeredQuestions.includes('ménage . région . IdF') ||
            answeredQuestions.includes('logement . région . IdF')
          }
          $touched={answeredQuestions.includes('ménage . personnes')}
        >
          <PersonnesQuestion
            {...{
              defaultSituation,
              onChange,
              answeredQuestions,
              situation,
            }}
          />
        </Li>
        <Li
          key="revenu"
          $next={answeredQuestions.includes('ménage . personnes')}
          $touched={answeredQuestions.includes('ménage . revenu')}
        >
          <RevenuQuestion
            {...{
              answeredQuestions,
              situation,
              engine,
              setSearchParams,
            }}
          />
        </Li>
      </QuestionList>
      <UserData {...{ setSearchParams, situation }} />
      <EvaluationValue
        {...{
          engine,
          situation,
          shouldDisplay,
          noDefaultSituation,
          currentDPE,
          targetDPE,
        }}
      />
    </ModuleWrapper>
  ) : (
    <AmpleurWidget
      {...{
        onChange,
        engine,
        shouldDisplay,
        situation,
        setSearchParams,
        answeredQuestions,
        isMobile,
      }}
    />
  )
}
