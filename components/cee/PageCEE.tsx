'use client'
import {
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import { Badge, Main, Section } from '@/components/UI'
import rules from '@/app/règles/rules'
import Publicodes, { formatValue } from 'publicodes'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import { useSearchParams } from 'next/navigation'
import { BlocAideCEE } from '@/components/cee/BlocAideCee'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import OtherSimulateur from '../OtherSimulateur'
import { parse } from 'marked'
import useIsInIframe from '@/components/useIsInIframe'
import IframeIntegrator from '../IframeIntegrator'
import { push } from '@socialgouv/matomo-next'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'
import Accordion from '@codegouvfr/react-dsfr/Accordion'
import React from 'react'

export default function PageCEE({ params }: { params: { code: string } }) {
  const isInIframe = useIsInIframe()
  const engine = new Publicodes(rules)
  const rawSearchParams = useSearchParams(),
    situationSearchParams = Object.fromEntries(rawSearchParams.entries())
  if (isInIframe) {
    push(['trackEvent', 'Module', 'Page', 'Calculette CEE ' + params.code])
  }
  const allRuleConcerned = Object.keys(rules).filter(
    (rule) => rules[rule] && rules[rule].code == params.code,
  )
  const rule = allRuleConcerned[0]
  const answeredQuestions = [
    ...getAnsweredQuestions(situationSearchParams, rules),
  ]
  const situation = {
    ...getSituation(situationSearchParams, rules),
  }

  // Y a-t-il des MPR associés?
  const mprAssocie = allRuleConcerned
    .map((rule) => rule.replace('. CEE', '. MPR'))
    .filter((rule) => Object.keys(rules).includes(rule)) // On vérifie qu'il y a une règle MPR qui existe pour ce geste
    .map((rule) => rule.replace(' . MPR', ''))
    .map((rule) => rules[rule] && rules[rule].titre)

  const questions = getNextQuestions(
    engine.evaluate(rule + ' . montant'),
    [],
    [],
    rules,
  )

  const infoCEE = {
    montant: formatValue(
      engine.setSituation(situation).evaluate(rule + ' . montant'),
      { precision: 0 },
    ),
    code: rules[rule].code,
    titre: rules[rule].titre,
    lien: rules[rule].lien,
    technique: rules[rule].technique,
    questions: questions
      .filter((q) => q !== 'CEE . projet . remplacement chaudière thermique')
      .filter((q) => rules[q].question),
  }

  const setSearchParams = useSetSearchParams()

  return (
    <Main>
      <Section>
        <Breadcrumb
          currentPageLabel={infoCEE.titre}
          homeLinkProps={{
            href: '/',
          }}
          segments={[
            {
              label: 'Les aides',
              linkProps: {
                href: '/aides',
              },
            },
            {
              label: "Certificats d'économie d'énergie (CEE)",
              linkProps: {
                href: '/aides/cee',
              },
            },
          ]}
        />
        {!isInIframe && (
          <Link
            className="fr-btn fr-btn--secondary fr-icon-arrow-left-line fr-btn--icon-left fr-mb-5v"
            href="/aides/cee"
          >
            Retour à la liste des aides CEE
          </Link>
        )}
        <h1>
          {infoCEE.titre} <Badge>{infoCEE.code}</Badge>
        </h1>
        <div className="fr-callout fr-icon-info-line">
          <h3>Informations sur les conditions d'obtention</h3>
          <p>
            Vous êtes éligible aux aides des fournisseurs d’énergie (certificats
            d’économies d’énergie – CEE) si :
          </p>
          <ul>
            <li>
              vous êtes <strong>propriétaire ou locataire</strong> de votre
              résidence principale ou secondaire.
            </li>
            <li>
              le logement a été <strong>construit depuis plus de 2 ans.</strong>
            </li>
            <li>
              il s'agit de votre{' '}
              <strong>résidence principale ou secondaire</strong>.
            </li>
          </ul>
          <p>
            Il n'y a <strong>pas de plafond de ressources à respecter</strong>,
            mais le montant des aides des fournisseurs d’énergie (certificats
            d’économies d’énergie – CEE) peut varier en fonction de vos revenus.
          </p>
        </div>
        <h2>
          Calculer le montant de votre prime en répondant aux questions
          ci-dessous:
        </h2>
        <BlocAideCEE
          {...{
            infoCEE,
            rules,
            engine,
            situation,
            answeredQuestions,
            setSearchParams,
            displayPrime: 'bottom',
          }}
        />
        <Accordion
          className="fr-mb-5v"
          label="Détails techniques"
          onExpandedChange={() => {}}
        >
          testertest test
          <div dangerouslySetInnerHTML={{ __html: parse(infoCEE.technique) }} />
        </Accordion>
        <OtherSimulateur {...{ mprAssocie }} />
        <IframeIntegrator
          iframeUrl={`/aides/cee/${infoCEE.code}/${encodeURIComponent(infoCEE.titre)}`}
        />
      </Section>
    </Main>
  )
}
