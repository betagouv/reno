'use client'

import InputSwitch from '@/components/InputSwitch'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import {
  decodeDottedName,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import useIsInIframe from '@/components/useIsInIframe'
import useSetSearchParams from '@/components/useSetSearchParams'
import useSyncUrlLocalStorage from '@/utils/useSyncUrlLocalStorage'
import { useSearchParams } from 'next/navigation'
import Publicodes from 'publicodes'
import { Suspense, useMemo } from 'react'
import simulationConfig from './simulationConfig.yaml'
import Answers from './Answers'
import { CTA, CTAWrapper } from '@/components/UI'
import Link from 'next/link'

function Form({ rules }) {
  const isInIframe = useIsInIframe()
  useSyncUrlLocalStorage()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  // this param `objectif` lets us optionally build the form to target one specific publicode rule
  const { objectif, depuisModule, ...situationSearchParams } = searchParams

  const target = objectif ? decodeDottedName(objectif) : 'aides'

  const engine = useMemo(() => new Publicodes(rules), [rules])
  const answeredQuestions = [
    ...Object.keys(simulationConfig.situation || {}),
    ...getAnsweredQuestions(situationSearchParams, rules),
  ]

  const situation = {
    ...(simulationConfig.situation || {}),
    ...getSituation(situationSearchParams, rules),
  }

  const validatedSituation = Object.fromEntries(
    Object.entries(situation).filter(([k, v]) => answeredQuestions.includes(k)),
  )

  const evaluation = engine.setSituation(validatedSituation).evaluate(target),
    nextQuestions = getNextQuestions(
      evaluation,
      answeredQuestions,
      simulationConfig,
      rules,
    )

  const currentQuestion = nextQuestions[0],
    rule = currentQuestion && rules[currentQuestion]

  console.log({ nextQuestions })

  const setSearchParams = useSetSearchParams()

  if (depuisModule)
    return (
      <section
        css={`
          margin: 0 auto;
          padding: 0 2rem;
          max-width: 800px;
        `}
      >
        <CTAWrapper $justify="left">
          <CTA $fontSize="normal">
            <Link href={setSearchParams({ depuisModule: undefined }, 'url')}>
              ➞&nbsp;&nbsp;Continuer ma simulation
            </Link>
          </CTA>
        </CTAWrapper>
        <Answers
          {...{
            answeredQuestions,
            nextQuestions,
            currentQuestion,
            rules,
            engine,
            situation,
            startsOpen: true,
            closedTitle: 'Votre simulation en cours :',
          }}
        />
      </section>
    )

  return (
    <>
      {rule && (
        <InputSwitch
          {...{
            rules,
            currentQuestion,
            situation,
            answeredQuestions,
            setSearchParams,
            engine,
            nextQuestions,
            searchParams,
          }}
        />
      )}
      {isInIframe && (
        <p
          css={`
            font-size: 0.7rem;
            margin: 0 1rem;
            line-height: 1rem;
          `}
        >
          Un simulateur construit avec France&nbsp;Rénov' pour simplifier
          l'information sur les aides à la rénovation énergétique.
        </p>
      )}
    </>
  )
}

export default function ({ rules }) {
  return (
    <Suspense>
      <Form rules={rules} />
    </Suspense>
  )
}
