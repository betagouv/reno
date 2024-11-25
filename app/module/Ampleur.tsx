'use client'
import rules from '@/app/règles/rules'
import DPELabel from '@/components/DPELabel'
import DPEQuickSwitch from '@/components/DPEQuickSwitch'
import { CTA, PrimeStyle } from '@/components/UI'
import { createExampleSituation } from '@/components/ampleur/AmpleurSummary'
import useSyncAmpleurSituation from '@/components/ampleur/useSyncAmpleurSituation'
import useEnrichSituation from '@/components/personas/useEnrichSituation'
import {
  encodeDottedName,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
import rightArrow from '@/public/flèche-vers-droite.svg'
import logoFranceRenov from '@/public/logo-france-renov-sans-texte.svg'
import logo from '@/public/logo.svg'
import { push } from '@socialgouv/matomo-next'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import Publicodes from 'publicodes'
import { useMemo } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { Labels } from '../LandingUI'
import { Title } from '../LayoutUI'
import AmpleurCTA from './AmpleurCTA'
import { EvaluationValue } from './AmpleurEvaluation'
import { usageLogementValues } from './AmpleurInputs'
import {
  IdFQuestion,
  Li,
  PersonnesQuestion,
  QuestionList,
  RevenuQuestion,
  TypeResidence,
} from './AmpleurQuestions'
import { AmpleurWrapper } from './AmpleurUI'

const engine = new Publicodes(rules)

export default function Ampleur() {
  const setSearchParams = useSetSearchParams()
  const isMobile = useMediaQuery('(max-width: 400px)')

  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  const { persona: selectedPersona = 0, ...situationSearchParams } =
    searchParams

  const userSituation = getSituation(situationSearchParams, rules)
  const answeredQuestions = getAnsweredQuestions(situationSearchParams, rules)
  console.log('cyan answeredQuestions', answeredQuestions)

  const currentDPE = +userSituation['DPE . actuel']
  const targetDPE =
    +userSituation['projet . DPE visé'] || Math.max(currentDPE - 2, 1)

  const extremeSituation = createExampleSituation(engine, {}, true)

  const defaultSituation = {
    ...extremeSituation, // pour déclencher Denormandie, taxe foncière, etc
    ...usageLogementValues[0].situation,
    'vous . propriétaire . condition': 'oui',
    'ménage . revenu': 25000, // Le revenu médian est de 20 000, mais le mettre à 25 000 permet de faire en sorte qu'il y ait une différence entre IdF et hors IdF pour que la case à cocher ait un effet
    'ménage . personnes': 2,
    'ménage . région . IdF': 'non',
  }

  const rawSituation = useMemo(
    () => ({
      ...defaultSituation,
      'projet . DPE visé': targetDPE,
      ...userSituation,
    }),
    [rawSearchParams.toString()],
  )

  const enrichedSituation = useEnrichSituation(rawSituation)
  const situation = enrichedSituation || rawSituation

  const savedSituation = useSyncAmpleurSituation(situation)

  if (!currentDPE || isNaN(currentDPE))
    return (
      <p>
        Un DPE est nécessaire pour utiliser estimer les aides à la rénovation
        d'ampleur.
      </p>
    )

  const onChange =
    (dottedName) =>
    ({ target: { value } }) =>
      setSearchParams({
        [encodeDottedName(dottedName)]: value + '*',
      })

  push(['trackEvent', 'Iframe', 'Page', 'Module Ampleur DPE ' + currentDPE])

  return (
    <AmpleurWrapper>
      <header>
        <div>
          <Labels
            css={`
              margin: 0;
              li  {
                background: #fdf8db;

                color: #6e4444;
              }
            `}
          >
            {[' ⭐️ Rénovation énergétique'].map((text) => (
              <li key={text}>{text}</li>
            ))}
          </Labels>
          <h2>Vos aides pour une rénovation d'ampleur</h2>
        </div>
        <a
          href="https://mesaidesreno.beta.gouv.fr"
          css={`
            text-decoration: none;
            color: inherit;
            > div {
              @media (max-width: 400px) {
                top: 0rem;
                right: 0.4rem;
                img {
                  width: 2rem !important;
                }
                h1 {
                  line-height: 0.8rem;
                  font-size: 80%;
                  width: 2rem;
                }

                position: absolute;
              }
            }
          `}
        >
          <div
            css={`
              display: flex;
              align-items: center;
              font-size: 90%;
            `}
          >
            <Image
              src={logo}
              alt="Logo de Mes Aides Réno"
              css={`
                width: 2.6rem !important;
              `}
            />
            <Title>
              Mes <strong>Aides Réno</strong>
            </Title>
          </div>
        </a>
      </header>
      <div>
        <p>
          {!isMobile
            ? "Pour bénéficier des aides pour une rénovation d'ampleur, v"
            : 'V'}
          ous devez viser un saut d'au moins 2{' '}
          {isMobile ? 'DPE' : 'classes de DPE'}, soit passer du DPE actuel{' '}
          <DPELabel index={currentDPE - 1} /> à{isMobile ? '' : ' un '}
          <DPEQuickSwitch
            oldIndex={targetDPE - 1}
            prefixText={''}
            prefixDPE={isMobile ? false : true}
            dottedName="projet . DPE visé"
            situation={situation}
          />
          .
        </p>
        <QuestionList>
          <Li
            key="typeResidence"
            $touched={answeredQuestions.includes(
              'logement . résidence principale propriétaire',
            )}
          >
            <Dot />
            <TypeResidence
              {...{ setSearchParams, situation, answeredQuestions }}
            />
          </Li>
          <Li
            $touched={answeredQuestions.includes('ménage . région . IdF')}
            key="IdF"
          >
            <Dot />

            <IdFQuestion
              {...{
                setSearchParams,
                isMobile,
                situation,
                answeredQuestions,
              }}
            />
          </Li>
          <Li
            key="personnes"
            $touched={answeredQuestions.includes('ménage . personnes')}
          >
            <Dot />
            <PersonnesQuestion
              {...{
                defaultSituation,
                onChange,
              }}
            />
          </Li>
          <Li
            key="revenu"
            $touched={answeredQuestions.includes('ménage . revenu')}
          >
            <Dot />
            <RevenuQuestion
              {...{
                answeredQuestions,
                situation,
                engine,
                setSearchParams,
              }}
            />
          </Li>
        </QuestionList>
        <h3>Parmi vos aides :</h3>
        {answeredQuestions.length < 6 ? (
          <p>
            <PrimeStyle>Vos aides ici</PrimeStyle>
          </p>
        ) : (
          <EvaluationValue {...{ engine, situation }} />
        )}
        <section>
          {answeredQuestions.length < 6 && (
            <CTA
              css={`
                margin-bottom: 0;
                a  {
                  display: flex;
                  font-size: 85% !important;
                  align-items: center;
                  img {
                    height: 2rem;
                    width: auto;
                    margin-right: 0.6rem;
                  }
                }
              `}
            >
              <AmpleurCTA {...{ situation }} />
            </CTA>
          )}
        </section>
      </div>
      <footer
        css={`
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: -1rem;

          p {
            margin: 0;
            margin-right: 1rem;
          }
        `}
      >
        <p>
          <small
            css={`
              line-height: 1rem;
              color: gray;
              display: block;
            `}
          >
            Une initiative construite avec France&nbsp;Rénov{"'"}
            {isMobile
              ? '.'
              : ` pour simplifier
            l'information sur les aides à la rénovation énergétique.`}
          </small>
        </p>

        <Image
          src={logoFranceRenov}
          alt="Logo de France Rénov"
          css={`
            width: 6.5rem !important;
            margin-right: 1rem;
            @media (max-width: 400px) {
              width: 5rem !important;
              margin: 0;
            }
          `}
        />
      </footer>
    </AmpleurWrapper>
  )
}

const Dot = () => (
  <Image
    src={rightArrow}
    alt="Icône d'une flèche vers la droite"
    css={`
      @media (max-width: 400px) {
        display: none;
      }
    `}
  />
)
