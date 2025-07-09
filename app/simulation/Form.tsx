'use client'

import InputSwitch from '@/components/InputSwitch'
import { CTA, CTAWrapper, Section } from '@/components/UI'
import getNextQuestions, {
  getNextQuestionsMainForm,
} from '@/components/publicodes/getNextQuestions'
import {
  decodeDottedName,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import useIsInIframe from '@/components/useIsInIframe'
import useSetSearchParams from '@/components/useSetSearchParams'
import simulationConfigAdapt from './simulationConfigAdapt.yaml'
import useSyncUrlLocalStorage from '@/utils/useSyncUrlLocalStorage'
import { useSearchParams } from 'next/navigation'
import Publicodes from 'publicodes'
import { Suspense, useMemo } from 'react'
import simulationConfigMainForm from './simulationConfigMainForm.yaml'
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
import AidesLocales from '@/components/ampleur/AidesLocales'
import AideEtapes from '@/components/AideEtapes'
import MaPrimeAdaptOccupant from '@/components/maPrimeAdapt/MaPrimeAdaptOccupant'
import MaPrimeAdaptBailleur from '@/components/maPrimeAdapt/MaPrimeAdaptBailleur'
import MaPrimeAdaptCopropriété from '@/components/maPrimeAdapt/MaPrimeAdaptCopropriété'
import LocAvantage from '@/components/LocAvantage'

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
  'mpa . occupant': MaPrimeAdaptOccupant,
  'mpa . bailleur': MaPrimeAdaptBailleur,
  'mpa . copropriété': MaPrimeAdaptCopropriété,
  locavantage: LocAvantage,
}

function Form({ rules }) {
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
    nextQuestions = getNextQuestionsMainForm(
      evaluation,
      answeredQuestions,
      target == 'mpa . montant'
        ? simulationConfigAdapt
        : simulationConfigMainForm,
    )
  console.log('nextQuestions', nextQuestions)
  const currentQuestion = nextQuestions[0]

  // Hack pour MPA: il est préférable de gérer l'inéligibilité autrement
  // if (target === 'mpa . montant' && !rules['mpa . montant']) {
  //   return (
  //     <CustomQuestionWrapper>
  //       <CTAWrapper>
  //         <CTA
  //           $fontSize="normal"
  //           $importance="emptyBackground"
  //           css={`
  //             a {
  //               padding: 0.5rem 0.8rem;
  //             }
  //           `}
  //         >
  //           <span onClick={() => history.back()}>⬅ Retour</span>
  //         </CTA>
  //       </CTAWrapper>
  //       <header>
  //         <small>Eligibilité</small>
  //       </header>
  //       <p>
  //         Vous n'êtes <No>pas éligible</No> au dispositif MaPrimeAdapt'.
  //       </p>
  //     </CustomQuestionWrapper>
  //   )
  // }

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
      {
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
            correspondance,
          }}
        />
      }
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
