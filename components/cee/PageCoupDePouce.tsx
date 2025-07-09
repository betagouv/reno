'use client'
import {
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import {
  CTA,
  CTAWrapper,
  InternalLink,
  Main,
  MiseEnAvant,
  Section,
} from '@/components/UI'
import rules from '@/app/règles/rules'
import Publicodes, { formatValue } from 'publicodes'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import { useSearchParams } from 'next/navigation'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import OtherSimulateur from '../OtherSimulateur'
import css from '@/components/css/convertToJs'
import { BlocAideCoupDePouce } from './BlocAideCoupDePouce'
import IframeIntegrator from '../IframeIntegrator'
import useIsInIframe from '@/components/useIsInIframe'
import Breadcrumb from '../Breadcrumb'

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
          links={[
            { 'Les aides': '/aides' },
            { 'Coup de Pouce Chauffage': '/aides/coup-de-pouce' },
            { [infoCoupDePouce.titre]: '' },
          ]}
        />
        {!isInIframe && (
          <CTAWrapper $justify="end">
            <CTA
              $fontSize="normal"
              $importance="secondary"
              css={`
                a {
                  padding: 0.5rem 0.8rem;
                }
              `}
            >
              <Link href="/aides/coup-de-pouce">
                <span aria-hidden="true">⬅</span> Retour à la liste des aides
                Coup de pouce
              </Link>
            </CTA>
          </CTAWrapper>
        )}
        <h1
          style={css`
            margin: 0 0 1rem;
          `}
        >
          {infoCoupDePouce.titre}
        </h1>
        <MiseEnAvant>
          <h2
            style={css`
              color: #0063cb;
            `}
          >
            Informations
          </h2>
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
          <p
            style={css`
              margin: 1rem 0 0 0;
            `}
          >
            Il n'y a <strong>pas de plafond de ressources à respecter</strong>,
            mais le montant de l'aide peut varier en fonction de vos revenus.
          </p>
          <p>
            Si vous ne remplacez <strong>pas de chaudière</strong>, vous êtes
            tout de même éligible à{' '}
            <InternalLink
              href={`/cee/${ceeAssocie.code}/${encodeURIComponent(ceeAssocie.titre)}`}
            >
              <strong>l'aide CEE {ceeAssocie.code}</strong>
            </InternalLink>{' '}
            .
          </p>
        </MiseEnAvant>
        <h2
          style={css`
            font-size: 130%;
          `}
        >
          Calculer le montant de votre prime "Coup de Pouce"
        </h2>
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
