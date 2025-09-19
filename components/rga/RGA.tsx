'use client'

import simulationConfig from '@/app/rga/simulationConfig.yaml'
import rules, { noDefaultsRules } from '@/app/règles/rules'
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
import { PageBlock } from '../UI'
import Explication from './Explication'

const content = rules['rga'].descriptionHtml

const noDefaultsEngine = new Publicodes(noDefaultsRules)
const engine = new Publicodes(rules)

export default function RGA() {
  useSyncUrlLocalStorage()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
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
  const evaluation = noDefaultsEngine
    .setSituation(validatedSituation)
    .evaluate('rga . montant')

  const nextQuestions = getNextQuestions(
    evaluation,
    answeredQuestions,
    simulationConfig,
  )

  console.log({
    evaluation,
    answeredQuestions,
  })
  console.log('nextQuestions', nextQuestions)
  console.log('score', evaluation.missingVariables)

  const currentQuestion = nextQuestions[0],
    rule = currentQuestion && rules[currentQuestion]

  console.log('mv', rule)

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
