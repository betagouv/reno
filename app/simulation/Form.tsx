'use client'

import InputSwitch from '@/components/InputSwitch'
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
import { push } from '@socialgouv/matomo-next'
import AideDetails from '@/components/AideDetails'
import MPRA from '@/components/ampleur/MPRA'
import AideMAR from '@/components/ampleur/AideMAR'
import CEEAmpleur from '@/components/ampleur/CEEAmpleur'
import Copro from '@/components/ampleur/Copro'
import Denormandie from '@/components/ampleur/Denormandie'
import EcoPTZ from '@/components/ampleur/EcoPTZ'
import PAR from '@/components/ampleur/PAR'
import TaxeFoncière from '@/components/ampleur/TaxeFoncière'
import TVA from '@/components/autres-aides/TVA'
import CreditImpot from '@/components/autres-aides/CreditImpot'
import AidesLocales from '@/components/ampleur/AidesLocales'
import AideEtapes from '@/components/AideEtapes'
import MaPrimeAdapt from '@/components/maPrimeAdapt/MaPrimeAdapt'
import LocAvantage from '@/components/LocAvantage'
import getNextQuestions from '@/components/publicodes/getNextQuestions'

export const correspondance = {
  'MPR . accompagnée': MPRA,
  'MPR . accompagnée . prise en charge MAR': AideMAR,
  PTZ: EcoPTZ,
  PAR: PAR,
  'aides locales': AidesLocales,
  'ampleur . prime individuelle copropriété': Copro,
  'taxe foncière': TaxeFoncière,
  denormandie: Denormandie,
  "CEE . rénovation d'ampleur": CEEAmpleur,
  mpa: MaPrimeAdapt,
  locavantage: LocAvantage,
  'tva réduite': TVA,
  "crédit d'impôt": CreditImpot,
}

function Form({ rules, simulationConfig }) {
  const isInIframe = useIsInIframe()
  if (isInIframe) {
    push(['trackEvent', 'Iframe', 'Page', 'Simulation'])
  }

  useSyncUrlLocalStorage()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  // this param `objectif` lets us optionally build the form to target one specific publicode rule
  const { objectif, depuisModule, ...situationSearchParams } = searchParams

  const target = objectif ? decodeDottedName(objectif) : 'aides'

  const engine = useMemo(
    () =>
      new Publicodes(rules, {
        logger: {
          warn: () => {},
          log: () => {},
          error: (message) => console.error(message),
        },
      }),
    [rules],
  )
  const answeredQuestions = getAnsweredQuestions(situationSearchParams, rules)
  const situation = getSituation(situationSearchParams, rules)
  const validatedSituation = Object.fromEntries(
    Object.entries(situation).filter(([k, v]) => answeredQuestions.includes(k)),
  )
  const setSearchParams = useSetSearchParams()
  if (target == 'etape') {
    return (
      <AideEtapes
        {...{
          searchParams,
          setSearchParams,
          situation,
          answeredQuestions,
          engine,
        }}
      />
    )
  }
  const evaluation = engine.setSituation(validatedSituation).evaluate(target),
    nextQuestions = getNextQuestions(
      evaluation,
      answeredQuestions,
      simulationConfig,
    )
  const currentQuestion = objectif
    ? decodeDottedName(objectif)
    : nextQuestions[0]

  if (searchParams['details']) {
    return (
      <AideDetails
        {...{
          currentQuestion,
          searchParams,
          setSearchParams,
          situation,
          answeredQuestions,
          engine,
          rules,
          correspondance,
          nextQuestions,
        }}
      />
    )
  }
  return (
    <>
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

export default function ({ rules, simulationConfig }) {
  return (
    <Suspense>
      <Form rules={rules} simulationConfig={simulationConfig} />
    </Suspense>
  )
}
