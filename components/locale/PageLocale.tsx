'use client'
import { getSituation } from '@/components/publicodes/situationUtils'
import { CTA, CTAWrapper, ExternalLink, Main, MiseEnAvant, Section } from '@/components/UI'
import rules from '@/app/règles/rules'
import Publicodes, { formatValue } from 'publicodes'
import getNextQuestions from '@/components/publicodes/getNextQuestions'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import css from '@/components/css/convertToJs'
import useSetSearchParams from '../useSetSearchParams'
import useIsInIframe from '@/components/useIsInIframe'
import Breadcrumb from '../Breadcrumb'
import { BlocAideLocale } from './BlocLocale'

export default function PageLocale({ params }: { params: { place: string } }) {

  const isInIframe = useIsInIframe()
  const engine = new Publicodes(rules)
  const rawSearchParams = useSearchParams(),
    situationSearchParams = Object.fromEntries(rawSearchParams.entries())
  const rule = Object.keys(rules).find((rule) => rule == "aides locales . "+decodeURIComponent(params.place))
  const situation = {
    ...getSituation(situationSearchParams, rules),
  }

  const info = {
    montant: formatValue(engine.setSituation(situation).evaluate(rule + ' . montant'), { precision: 0 }),
    titre: rules[rule].titre,
    questions: rules[rule].questions.valeurs,
  }
  
  console.log("missingVariables", engine.setSituation(situation).evaluate(rule + ' . montant').missingVariables)

  const setSearchParams = useSetSearchParams()

  return (
    <Main>
      <Section>
          { !isInIframe && (
            <>
              <Breadcrumb links={[
                  {"Les aides": "/aides"},
                  {"Aides locales": "/aides/locale"},
                  {[info.titre]: ""}
                ]} />
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
                  <Link href="/aides/locales">⬅ Retour à la liste des aides Locales</Link>
                  </CTA>
              </CTAWrapper>
            </>
          )}
          <h2 style={css`margin: 0 0 1rem;`}>{info.titre}</h2>
          <MiseEnAvant>
              <h3 style={css`color: #0063cb`}>Informations sur les conditions d'obtention:</h3>
              <ul>
                <li>Recours à un professionnel <strong>RGE</strong></li>
                <li>Le dépôt du dossier de demande d'aide s'effectue <strong>avant le démarrage des travaux</strong>.</li>
                <li>Vous pouvez déposer votre dossier en ligne sur <ExternalLink target="_blank" title="site officiel " href="#">[site grand narbonne]</ExternalLink>. </li>
              </ul>
          </MiseEnAvant>
          <BlocAideLocale
              {...{
              info,
              rules,
              engine,
              situation,
              setSearchParams
              }}
          />
      </Section>
    </Main>
  )
}
