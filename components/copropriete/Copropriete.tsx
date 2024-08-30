'use client'

import InputSwitch from '@/components/InputSwitch'
import { Section } from '@/components/UI'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import rules from '@/app/règles/rules'
import { getAnsweredQuestions, getSituation } from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import Publicodes from 'publicodes'
import simulationConfigCopropriete from '../../app/copropriete/simulationConfigCopro.yaml'
import { Suspense, useMemo } from 'react'
import useSyncUrlLocalStorage from '@/utils/useSyncUrlLocalStorage'
import { useSearchParams } from 'next/navigation'
import Answers from '@/app/simulation/Answers'
import ExplicationCopropriete from './ExplicationCopropriete'

export default function Copropriete() {
    useSyncUrlLocalStorage()
    const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
    const engine = useMemo(() => new Publicodes(rules), [rules])
    const answeredQuestions = [
        ...Object.keys(simulationConfigCopropriete.situation || {}),
        ...getAnsweredQuestions(searchParams, rules),
    ]
    const situation = {
        ...(simulationConfigCopropriete.situation || {}),
        ...getSituation(searchParams, rules),
    }
  
    const validatedSituation = Object.fromEntries(
      Object.entries(situation).filter(([k, v]) => answeredQuestions.includes(k)),
    )
    const evaluation = engine.setSituation(validatedSituation).evaluate('copropriété . montant')
    // On ne pose pas la question du montant des travaux dans le formulaire
    // Il sera modifiable dans l'explication
    const nextQuestions = getNextQuestions(
        evaluation,
        answeredQuestions,
        simulationConfigCopropriete,
        rules,
      ).filter((q) => q != "copropriété . montant travaux") 
    const currentQuestion = nextQuestions[0],
      rule = currentQuestion && rules[currentQuestion]
    const setSearchParams = useSetSearchParams()

    return (
    <Suspense>
      <Section>
        <Answers
          {...{
            answeredQuestions,
            nextQuestions,
            currentQuestion,
            rules,
            situation,
          }}
        />
        {rule ? (
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
        ) : (
          <ExplicationCopropriete
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
      </Section>
    </Suspense>
  )
}
