'use client'

import rules from '@/app/règles/rules'
import InputSwitch from '@/components/InputSwitch'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import {
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import useSyncUrlLocalStorage from '@/utils/useSyncUrlLocalStorage'
import { useSearchParams } from 'next/navigation'
import Publicodes from 'publicodes'
import { useMemo } from 'react'
import simulationConfig from '@/app/rga/simulationConfig.yaml'
import Explication from './Explication'
import { PageBlock } from '../UI'

const content = rules['rga'].descriptionHtml

export default function RGA() {
  useSyncUrlLocalStorage()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const engine = useMemo(() => new Publicodes(rules), [rules])
  const answeredQuestions = [
    ...Object.keys(simulationConfig.situation || {}),
    ...getAnsweredQuestions(searchParams, rules),
  ]
  const situation = {
    ...(simulationConfig.situation || {}),
    ...getSituation(searchParams, rules),
  }

  const validatedSituation = Object.fromEntries(
    Object.entries(situation).filter(([k, v]) => answeredQuestions.includes(k)),
  )
  const evaluation = engine
    .setSituation(validatedSituation)
    .evaluate('rga . montant')

  const nextQuestions = getNextQuestions(
    evaluation,
    answeredQuestions,
    simulationConfig,
  )

  console.log({ evaluation, answeredQuestions, nextQuestions })
  const currentQuestion = nextQuestions[0],
    rule = currentQuestion && rules[currentQuestion]
  const setSearchParams = useSetSearchParams()

  return (
    <PageBlock>
      {rule ? (
        <>
          <InputSwitch
            {...{
              form: 'rga',
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
          <div
            className="fr-mt-5v"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </>
      ) : (
        <Explication
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
    </PageBlock>
  )
}
