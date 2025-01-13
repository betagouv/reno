'use client'
import {
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import {
  Badge,
  CTA,
  CTAWrapper,
  Main,
  MiseEnAvant,
  Section,
} from '@/components/UI'
import rules from '@/app/règles/rules'
import Publicodes, { formatValue } from 'publicodes'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import { useSearchParams } from 'next/navigation'
import { BlocAideCEE } from '@/components/cee/BlocAideCee'
import useSetSearchParams from '@/components/useSetSearchParams'
import Link from 'next/link'
import OtherSimulateur from '../OtherSimulateur'
import { parse } from 'marked'
import css from '@/components/css/convertToJs'
import { Card } from '@/components/UI'
import useIsInIframe from '@/components/useIsInIframe'
import IframeIntegrator from '../IframeIntegrator'
import Breadcrumb from '../Breadcrumb'

export default function PageCEE({ params }: { params: { code: string } }) {
  const isInIframe = useIsInIframe()
  const engine = new Publicodes(rules)
  const rawSearchParams = useSearchParams(),
    situationSearchParams = Object.fromEntries(rawSearchParams.entries())

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
          links={[
            { 'Les aides': '/aides' },
            { "Certificats d'économie d'énergie (CEE)": '/aides/cee' },
            { [infoCEE.titre]: '' },
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
              <Link href="/aides/cee">⬅ Retour à la liste des aides CEE</Link>
            </CTA>
          </CTAWrapper>
        )}
        <h1
          style={css`
            margin: 0 0 1rem;
          `}
        >
          {infoCEE.titre} <Badge>{infoCEE.code}</Badge>
        </h1>
        <MiseEnAvant>
          <h2
            style={css`
              color: #0063cb;
            `}
          >
            Informations
          </h2>
          <p
            style={css`
              margin: 1rem 0;
            `}
          >
            Il n'y a <strong>pas de plafond de ressources à respecter</strong>.
          </p>
          Vous êtes éligible à cette aide si:
          <ul>
            <li>
              vous êtes <strong>propriétaire ou locataire</strong> de votre
              résidence principale ou secondaire.
            </li>
            <li>
              le logement a été <strong>construit depuis plus de 2 ans.</strong>
            </li>
          </ul>
        </MiseEnAvant>
        <h2
          style={css`
            font-size: 130%;
          `}
        >
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
        <details>
          <summary
            style={css`
              font-size: 1.25rem;
              font-weight: bold;
            `}
          >
            Détails techniques
          </summary>
          <Card
            dangerouslySetInnerHTML={{ __html: parse(infoCEE.technique) }}
          ></Card>
        </details>
        <OtherSimulateur {...{ mprAssocie }} />
        <IframeIntegrator
          iframeUrl={`/aides/cee/${infoCEE.code}/${encodeURIComponent(infoCEE.titre)}`}
        />
      </Section>
    </Main>
  )
}
