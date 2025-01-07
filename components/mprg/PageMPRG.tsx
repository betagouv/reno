'use client'
import { getSituation } from '@/components/publicodes/situationUtils'
import {
  CTA,
  CTAWrapper,
  ExternalLink,
  Main,
  MiseEnAvant,
  Section,
} from '@/components/UI'
import rules from '@/app/règles/rules'
import simulationConfig from '../../app/simulation/simulationConfigMPR.yaml'
import Publicodes, { formatValue } from 'publicodes'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BlocAideMPR } from './BlocAideMPR'
import OtherSimulateur from '../OtherSimulateur'
import css from '@/components/css/convertToJs'
import useSetSearchParams from '../useSetSearchParams'
import IframeIntegrator from '../IframeIntegrator'
import useIsInIframe from '@/components/useIsInIframe'
import Breadcrumb from '../Breadcrumb'

export default function PageMPRG({ params }: { params: { titre: string } }) {
  const isInIframe = useIsInIframe()
  const engine = new Publicodes(rules)
  const rawSearchParams = useSearchParams(),
    situationSearchParams = Object.fromEntries(rawSearchParams.entries())

  const rule = Object.keys(rules).find(
    (rule) =>
      rules[rule] && rules[rule].titre == decodeURIComponent(params.titre),
  )
  const situation = {
    ...getSituation(situationSearchParams, rules),
  }

  const questions = getNextQuestions(
    engine.evaluate(rule + ' . MPR . montant'),
    [],
    simulationConfig,
    rules,
  )
  const infoMPR = {
    montant: formatValue(
      engine.setSituation(situation).evaluate(rule + ' . MPR . montant'),
      { precision: 0 },
    ),
    titre: rules[rule].titre,
    plafond: formatValue(
      engine.setSituation(situation).evaluate(rule + ' . MPR . plafond'),
    ),
    questions: questions.filter((q) => rules[q].question),
  }

  // Y a-t-il une aide CEE associée?
  const ceeAssocie = Object.keys(rules).includes(rule + ' . CEE')
    ? rules[rule + ' . CEE']
    : null

  const setSearchParams = useSetSearchParams()

  return (
    <Main>
      <Section>
        <Breadcrumb
          links={[
            { 'Les aides': '/aides' },
            { "MaPrimeRénov' - Parcours par geste": '/aides/ma-prime-renov' },
            { [infoMPR.titre]: '' },
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
              <Link href="/aides/ma-prime-renov">
                ⬅ Retour à la liste des aides MaPrimeRénov'
              </Link>
            </CTA>
          </CTAWrapper>
        )}
        <h2
          style={css`
            margin: 0 0 1rem;
          `}
        >
          {infoMPR.titre}
        </h2>
        <MiseEnAvant>
          <h3
            style={css`
              color: #0063cb;
            `}
          >
            Informations sur les conditions d'obtention:
          </h3>
          <ul>
            <li>
              La prestation doit être inférieure à{' '}
              <strong>{infoMPR.plafond}</strong>.
            </li>
            <li>
              Recours à un professionnel <strong>RGE</strong>
            </li>

            {rules[rule + ' . MPR']?.description && (
              <li>{rules[rule + ' . MPR']?.description}</li>
            )}
            <li>
              Le dépôt du dossier de demande d'aide s'effectue{' '}
              <strong>avant le démarrage des travaux</strong>.
            </li>
            <li>
              Vous pouvez déposer votre dossier en ligne sur{' '}
              <ExternalLink
                target="_blank"
                title="site officiel Ma Prime Rénov'"
                href="https://maprimerenov.gouv.fr"
              >
                maprimerenov.gouv.fr
              </ExternalLink>
              .{' '}
            </li>
          </ul>
        </MiseEnAvant>
        <BlocAideMPR
          {...{
            infoMPR,
            rules,
            engine,
            situation,
            setSearchParams,
            displayPrime: 'bottom',
          }}
        />
        <OtherSimulateur {...{ ceeAssocie }} />
        <IframeIntegrator
          iframeUrl={`/aides/ma-prime-renov/${encodeURIComponent(infoMPR.titre)}`}
        />
      </Section>
    </Main>
  )
}
