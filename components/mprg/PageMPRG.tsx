'use client'
import { getSituation } from '@/components/publicodes/situationUtils'
import { ExternalLink, Main, Section } from '@/components/UI'
import rules from '@/app/règles/rules'
import simulationConfig from '../../app/simulation/simulationConfigMPR.yaml'
import Publicodes, { formatValue } from 'publicodes'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { BlocAideMPR } from './BlocAideMPR'
import OtherSimulateur from '../OtherSimulateur'
import useSetSearchParams from '../useSetSearchParams'
import IframeIntegrator from '../IframeIntegrator'
import useIsInIframe from '@/components/useIsInIframe'
import { push } from '@socialgouv/matomo-next'
import Breadcrumb from '@codegouvfr/react-dsfr/Breadcrumb'

export default function PageMPRG({ params }: { params: { titre: string } }) {
  const isInIframe = useIsInIframe()
  const engine = new Publicodes(rules)
  const rawSearchParams = useSearchParams(),
    situationSearchParams = Object.fromEntries(rawSearchParams.entries())
  if (isInIframe) {
    push(['trackEvent', 'Module', 'Page', 'Calculette MPR ' + params.titre])
  }
  const rule = Object.keys(rules).find(
    (rule) =>
      rules[rule] &&
      rules[rule].titre == decodeURIComponent(params.titre) &&
      !rule.includes('type'),
  )
  const situation = {
    ...getSituation(situationSearchParams, rules),
  }

  // Le setSituation est nécessaire pour que les nextQuestions soient à jour
  const questions = getNextQuestions(
    engine.setSituation(situation).evaluate(rule + ' . MPR . montant'),
    [],
    simulationConfig,
    rules,
  )
  // On ajoute les questions déja répondues qui ne sont pas renvoyées par le getNextQuestions
  questions.unshift(...Object.keys(situation))

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
          currentPageLabel={infoMPR.titre}
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
              label: "MaPrimeRénov' rénovation par geste",
              linkProps: {
                href: '/aides/ma-prime-renov',
              },
            },
          ]}
        />
        {!isInIframe && (
          <Link
            className="fr-btn fr-btn--secondary fr-icon-arrow-left-line fr-btn--icon-left fr-mb-5v"
            href="/aides/ma-prime-renov"
          >
            Retour à la liste des aides MaPrimeRénov'
          </Link>
        )}
        <h1>{infoMPR.titre}</h1>
        <div className="fr-callout fr-icon-info-line">
          <h2>Informations sur les conditions d'obtention</h2>
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
                title="site officiel MaPrimeRénov'"
                href="https://maprimerenov.gouv.fr"
              >
                maprimerenov.gouv.fr
              </ExternalLink>
              .{' '}
            </li>
          </ul>
        </div>
        <BlocAideMPR
          {...{
            infoMPR,
            rules,
            engine,
            situation,
            setSearchParams,
            display: 'bottom',
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
