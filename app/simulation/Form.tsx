'use client'

import InputSwitch from '@/components/InputSwitch'
import {
  decodeDottedName,
  encodeDottedName,
  encodeSituation,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import useIsInIframe from '@/components/useIsInIframe'
import useSetSearchParams from '@/components/useSetSearchParams'
import useSyncUrlLocalStorage from '@/utils/useSyncUrlLocalStorage'
import { useSearchParams } from 'next/navigation'
import Publicodes from 'publicodes'
import { Suspense, useEffect, useMemo, useState } from 'react'
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
import TVA from '@/components/maPrimeAdapt/TVA'
import CreditImpot from '@/components/maPrimeAdapt/CreditImpot'
import PAH from '@/components/maPrimeAdapt/PAH'
import PCH from '@/components/maPrimeAdapt/PCH'
import APA from '@/components/maPrimeAdapt/APA'
import AidesLocales from '@/components/ampleur/AidesLocales'
import AideEtapes from '@/components/AideEtapes'
import MaPrimeAdapt from '@/components/maPrimeAdapt/MaPrimeAdapt'
import LocAvantage from '@/components/LocAvantage'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import MaPrimeLogementDecent from '@/components/maPrimeLogementDecent/MaPrimeLogementDecent'
import AEEH from '@/components/maPrimeAdapt/AEEH'
import { enrichSituationWithLatLon } from '@/components/personas/enrichSituation'
import { Loader } from '../trouver-conseiller-france-renov/UI'

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
  pah: PAH,
  pch: PCH,
  apa: APA,
  aeeh: AEEH,
  MPLD: MaPrimeLogementDecent,
}

function Form({ rules, simulationConfig }) {
  const isInIframe = useIsInIframe()
  if (isInIframe) {
    push(['trackEvent', 'Iframe', 'Page', 'Simulation'])
  }
  const setSearchParams = useSetSearchParams()

  useSyncUrlLocalStorage()

  const rawSearchParams = useSearchParams()

  const { searchParams, objectif, situationSearchParams } = useMemo(() => {
    const sp = Object.fromEntries(rawSearchParams.entries())
    const { objectif, ...rest } = sp
    return {
      searchParams: sp,
      objectif,
      situationSearchParams: rest,
    }
  }, [rawSearchParams])

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

  const [isEnriching, setIsEnriching] = useState(false)
  useEffect(() => {
    async function ckeckEnrichSituation() {
      if (
        !(
          situationSearchParams['lat'] &&
          situationSearchParams['lon'] &&
          !situationSearchParams['logement.commune']
        )
      ) {
        setIsEnriching(false)
        return
      }
      setIsEnriching(true)

      const newSituation = await enrichSituationWithLatLon(
        situationSearchParams,
      )

      setSearchParams(encodeSituation(newSituation, true), 'replace', false)
      setIsEnriching(false)
    }
    ckeckEnrichSituation()
  }, [])
  const answeredQuestions = getAnsweredQuestions(situationSearchParams, rules)
  const situation = getSituation(situationSearchParams, rules)
  const validatedSituation = Object.fromEntries(
    Object.entries(situation).filter(([k]) => answeredQuestions.includes(k)),
  )

  if (target === 'etape') {
    return (
      <AideEtapes
        {...{
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
    <div style={{ maxWidth: '50rem', margin: 'auto' }}>
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
        <p className="fr-hint-text fr-mt-5v">
          Un simulateur construit avec France&nbsp;Rénov' pour simplifier
          l'information sur les aides à la rénovation énergétique.
        </p>
      )}
    </div>
  )
}

export default function ({ rules, simulationConfig }) {
  return (
    <Suspense>
      <Form rules={rules} simulationConfig={simulationConfig} />
    </Suspense>
  )
}
