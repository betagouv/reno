'use client'
import {
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import { Main, Section } from '@/components/UI'
import rules from '@/app/règles/rules'
import Publicodes, { formatValue } from 'publicodes'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import { useSearchParams } from 'next/navigation'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import OtherSimulateur from '../OtherSimulateur'
import { BlocAideCoupDePouce } from './BlocAideCoupDePouce'
import IframeIntegrator from '../IframeIntegrator'
import useIsInIframe from '@/components/useIsInIframe'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'

export default function PageCoupDePouce({
  params,
}: {
  params: { titre: string }
}) {
  const isInIframe = useIsInIframe()
  const engine = new Publicodes(rules)
  const rawSearchParams = useSearchParams(),
    situationSearchParams = Object.fromEntries(rawSearchParams.entries())

  const rule = Object.keys(rules).find(
    (rule) =>
      rules[rule] &&
      rules[rule].titre == decodeURIComponent(params.titre) &&
      !rule.includes('type'),
  )

  const answeredQuestions = [
    ...getAnsweredQuestions(situationSearchParams, rules),
  ]
  const situation = {
    ...getSituation(situationSearchParams, rules),
  }

  // On simule une situation avec remplacement de chaudière pour avoir accès à toutes les questions
  // Sinon, le applicable si fait que seule la question sur les remplacement de chaudière (et pas les revenus) est posée
  // Il faudrait dans publicode, en plus d'un missingVariables, un "allVariables"
  const questions = [
    'CEE . projet . remplacement chaudière thermique',
    ...getNextQuestions(
      engine
        .setSituation({
          [rule]: 'oui',
          'CEE . projet . remplacement chaudière thermique': 'oui',
        })
        .evaluate(rule + ' . Coup de pouce . montant'),
      [],
      [],
      rules,
    ),
  ]

  // Y a-t-il des MPR associés?
  const mprAssocie = Object.keys(rules).includes(rule + ' . MPR')
    ? [rules[rule].titre]
    : null
  // Y a-t-il une aide CEE associée?
  const ceeAssocie = Object.keys(rules).includes(rule + ' . CEE')
    ? rules[rule + ' . CEE']
    : null

  const infoCoupDePouce = {
    montant: formatValue(
      engine
        .setSituation(situation)
        .evaluate(rule + ' . Coup de pouce . montant'),
      { precision: 0 },
    ),
    isEligible:
      situation['CEE . projet . remplacement chaudière thermique'] !== 'non', // On se facilite la tache ici sur l'éligibilité qui est simple sur le coup de pouce
    titre: rules[rule].titre,
    questions: questions,
  }

  const setSearchParams = useSetSearchParams()

  return (
    <Main>
      <Section>
        <Breadcrumb
          currentPageLabel={infoCoupDePouce.titre}
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
              label: 'Coup de Pouce Chauffage',
              linkProps: {
                href: '/aides/coup-de-pouce',
              },
            },
          ]}
        />

        {!isInIframe && (
          <Link
            className="fr-btn fr-btn--secondary fr-icon-arrow-left-line fr-btn--icon-left fr-mb-5v"
            href="/aides/coup-de-pouce"
          >
            Retour à la liste des aides Coup de pouce
          </Link>
        )}
        <h1>{infoCoupDePouce.titre}</h1>
        <div className="fr-callout fr-icon-info-line">
          <h2>Informations</h2>
          <p>Vous êtes éligible à cette aide si:</p>
          <ul>
            <li>
              vous êtes <strong>propriétaire ou locataire</strong> de votre
              résidence <strong>principale ou secondaire</strong>.
            </li>
            <li>
              le logement a été <strong>construit depuis plus de 2 ans.</strong>
            </li>
            <li>
              vous remplacez une chaudière individuelle{' '}
              <strong>au charbon, au fioul ou au gaz</strong>
            </li>
          </ul>
          <p>
            Il n'y a <strong>pas de plafond de ressources à respecter</strong>,
            mais le montant de l'aide peut varier en fonction de vos revenus.
          </p>
          <p>
            Si vous ne remplacez <strong>pas de chaudière</strong>, vous êtes
            tout de même éligible à{' '}
            <a
              className="fr-link"
              href={`/cee/${ceeAssocie.code}/${encodeURIComponent(ceeAssocie.titre)}`}
            >
              l'aide CEE {ceeAssocie.code}
            </a>{' '}
            .
          </p>
        </div>
        <h2>Calculer le montant de votre prime "Coup de Pouce"</h2>
        <BlocAideCoupDePouce
          {...{
            infoCoupDePouce,
            rules,
            engine,
            situation,
            answeredQuestions,
            setSearchParams,
            displayPrime: 'bottom',
          }}
        />
        <OtherSimulateur {...{ mprAssocie, ceeAssocie }} />
        <IframeIntegrator
          iframeUrl={`/aides/coup-de-pouce/${encodeURIComponent(rules[rule].titre)}`}
        />
      </Section>
    </Main>
  )
}
