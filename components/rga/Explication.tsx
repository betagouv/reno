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

  const RGA_ALLOWED_DOMAINS = [
    // Domaines de développement
    'http://localhost:3000',
    'http://localhost:3001',
    // Domaines de production
    'https://staging.fonds-prevention-argile.beta.gouv.fr',
    'https://fonds-prevention-argile.beta.gouv.fr',
    'https://fonds-argile-staging.osc-fr1.scalingo.io',
    'https://fonds-argile.osc-secnum-fr1.scalingo.io',
  ]

  // Fonction pour envoyer les données au parent
  const handleDemandeClick = () => {
    if (window.parent !== window) {
      const parentOrigin = document.referrer
        ? new URL(document.referrer).origin
        : null

      // Vérifier si l'origine est autorisée
      if (parentOrigin && RGA_ALLOWED_DOMAINS.includes(parentOrigin)) {
        window.parent.postMessage(
          {
            type: 'RGA_DEMANDE_AIDE',
            searchParams: searchParamsString,
          },
          parentOrigin,
        )
      } else {
        // Fallback : envoyer à tous les domaines autorisés
        RGA_ALLOWED_DOMAINS.forEach((domain) => {
          window.parent.postMessage(
            {
              type: 'RGA_DEMANDE_AIDE',
              searchParams: searchParamsString,
            },
            domain,
          )
        })
      }
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

      {isEligibile ? (
        <div onClick={handleDemandeClick}>
          <CallOut
            buttonProps={{
              children: "Faire la demande d'aide",
            }}
            iconId="ri-information-line"
            title="Vous êtes éligible"
            colorVariant="green-emeraude"
          >
            Votre logement est éligible au dispositif.
          </CallOut>
        </div>
      ) : (
        <CallOut
          iconId="ri-cross-line"
          title="Vous n'êtes pas éligible"
          colorVariant="orange-terre-battue"
        >
          Votre logement n'est pas éligible au dispositif.
        </CallOut>
      )}

      <ExplicationsDétaillées {...{ situation, engine, answeredQuestions }} />
    </section>
  )
}
