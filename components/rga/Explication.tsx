'use client'

import rules from '@/app/règles/rules'
import {
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import useSyncUrlLocalStorage from '@/utils/useSyncUrlLocalStorage'
import Badge from '@codegouvfr/react-dsfr/Badge'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import CallOut from '@codegouvfr/react-dsfr/CallOut'
import Tag from '@codegouvfr/react-dsfr/Tag'
import { useSearchParams } from 'next/navigation'
import Publicodes from 'publicodes'
import { useMemo } from 'react'
import BtnBackToParcoursChoice from '../BtnBackToParcoursChoice'
import CopyButton from '../CopyButton'
import ExplicationsDétaillées from './ExplicationsDétaillées'

export default function Explication() {
  useSyncUrlLocalStorage()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const engine = useMemo(() => new Publicodes(rules), [rules])
  const answeredQuestions = [...getAnsweredQuestions(searchParams, rules)]
  const situation = getSituation(searchParams, rules)

  const engineSituation = engine.setSituation(situation)
  const setSearchParams = useSetSearchParams()

  const evaluation = engineSituation.evaluate('rga . conditions')
  const isEligibile = evaluation.nodeValue

  const searchParamsString = rawSearchParams.toString()

  return (
    <section>
      <Breadcrumb
        currentPageLabel="Éligibilité fonds de prévention argile"
        homeLinkProps={{
          href: '/',
        }}
        segments={[
          {
            label: 'Simulateur fonds de prévention argile',
            linkProps: {
              href: '/rga',
            },
          },
        ]}
      />
      <div
        css={`
          display: flex;
          justify-content: space-between;
          align-items: center;
        `}
      >
        <BtnBackToParcoursChoice
          {...{
            setSearchParams,
            situation,
            answeredQuestions: answeredQuestions.slice(0, -1),
          }}
        />
        <CopyButton searchParams={searchParams} />
      </div>
      <header className="fr-mt-5v">
        <Tag>Fonds de prévention argile</Tag>
        <h1>Votre éligibilité au fonds de prévention argile</h1>
      </header>

      <CallOut
        buttonProps={
          isEligibile
            ? {
                children: "Faire la demande d'aide",
                linkProps: {
                  href:
                    'https://fonds-argile-staging.osc-fr1.scalingo.io/demande?' +
                    searchParamsString,
                },
              }
            : undefined
        }
        iconId={
          isEligibile ? 'ri-information-line' : 'ri-cross-line' // ça marche pas, je sais pas pourquoi
        }
        title={isEligibile ? 'Vous êtes éligible' : "Vous n'êtes pas éligible"}
        colorVariant={isEligibile ? 'green-emeraude' : 'orange-terre-battue'}
      >
        Votre logement {isEligibile ? 'est éligible' : "n'est pas éligible"} au
        dispositif.
      </CallOut>

      <ExplicationsDétaillées {...{ situation, engine, answeredQuestions }} />
    </section>
  )
}
