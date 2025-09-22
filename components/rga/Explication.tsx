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
import Link from 'next/link'
import { push } from '@socialgouv/matomo-next'

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

  const RGA_DOMAIN = 'https://staging.fonds-prevention-argile.beta.gouv.fr' // TODO Variabiliser en production

  // Fonction pour envoyer les données au parent
  const handleDemandeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    // Envoie du message au parent avec les searchParams
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: 'RGA_DEMANDE_AIDE',
          searchParams: searchParamsString,
        },
        RGA_DOMAIN, // Domaine parent
      )
    }
  }

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
        {' '}
        <div>
          <BtnBackToParcoursChoice
            {...{
              setSearchParams,
              situation,
              answeredQuestions: answeredQuestions.slice(0, -1),
              whichSimulator: 'Simulateur RGA',
            }}
          />
          <Link
            className="fr-btn fr-btn--tertiary fr-icon-arrow-go-back-fill fr-btn--icon-left"
            css={`
              margin-left: 1rem;
            `}
            href={'/rga'}
            onClick={() =>
              push([
                'trackEvent',
                'Simulateur RGA',
                'Clic',
                'relance simulation',
              ])
            }
          >
            Recommencer la simulation
          </Link>
        </div>
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
                onClick: handleDemandeClick,
              }
            : undefined // Ne rien faire ?
        }
        iconId={isEligibile ? 'ri-information-line' : 'ri-cross-line'}
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
