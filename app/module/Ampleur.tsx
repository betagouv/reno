'use client'
import rules from '@/app/règles/rules'
import DPELabel from '@/components/DPELabel'
import DPEQuickSwitch from '@/components/DPEQuickSwitch'
import { CTA, InternalLink } from '@/components/UI'
import { createExampleSituation } from '@/components/ampleur/AmpleurSummary'
import useSyncAmpleurSituation from '@/components/ampleur/useSyncAmpleurSituation'
import { enrichSituationWithConstructionYear } from '@/components/personas/enrichSituation'
import useEnrichSituation from '@/components/personas/useEnrichSituation'
import {
  encodeDottedName,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import useSetSearchParams from '@/components/useSetSearchParams'
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
import { ampleurQuestionsAnswered, usageLogementValues } from './AmpleurInputs'
import {
  IdFQuestion,
  Li,
  PersonnesQuestion,
  QuestionList,
  RevenuQuestion,
  TypeResidence,
} from './AmpleurQuestions'
import { AmpleurWrapper } from './AmpleurUI'
import UserData from './UserData'

const engine = new Publicodes(rules)

export default function Ampleur() {
  const setSearchParams = useSetSearchParams()
  const isMobile = useMediaQuery('(max-width: 400px)')

  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  const { persona: selectedPersona = 0, ...situationSearchParams } =
    searchParams

  const rawUserSituation = getSituation(situationSearchParams, rules)

  const userSituation = useMemo(
    () => enrichSituationWithConstructionYear(rawUserSituation, engine),
    [rawUserSituation],
  )

  const answeredQuestionsFromUrl = getAnsweredQuestions(
    situationSearchParams,
    rules,
  )
  const answeredSituation = Object.fromEntries(
    answeredQuestionsFromUrl.map((dottedName) => [
      dottedName,
      userSituation[dottedName],
    ]),
  )

  console.log('cyan aq', answeredSituation)
  const savedSituation = useSyncAmpleurSituation(answeredSituation)
  console.log('cyan ss', savedSituation, userSituation)

  const answeredQuestions = savedSituation
    ? Object.keys(savedSituation)
    : answeredQuestionsFromUrl

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
      ...savedSituation,
      ...userSituation,
    }),
    [rawSearchParams.toString(), JSON.stringify(savedSituation)],
  )

  const enrichedSituation = useEnrichSituation(rawSituation)
  const situation = enrichedSituation || rawSituation

  const communeKey = 'logement . commune . nom'
  const commune = situation[communeKey]
  const noDefaultSituation = {
    ...savedSituation,
    ...userSituation,
    ...(commune ? { [communeKey]: commune } : {}),
  }

  console.log('cyan si', enrichedSituation)

  if (!currentDPE || isNaN(currentDPE))
    return (
      <p>
        Un DPE est nécessaire pour estimer les aides à la rénovation d'ampleur.
      </p>
    )

  const onChange =
    (dottedName) =>
    ({ target: { value } }) =>
      setSearchParams({
        [encodeDottedName(dottedName)]: value + '*',
      })

  return (
    <AmpleurWrapper>
      <header>
        <div>
          <h1>Vos aides pour une rénovation d'ampleur</h1>
        </div>
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
            possibilities={[0, 1, 2, 3, 4, 5, 6].filter(
              (index) => index < currentDPE - 2,
            )}
          />
          .
        </p>
        <QuestionList>
          <Li
            key="typeResidence"
            $next={true}
            $touched={answeredQuestions.includes(
              'logement . résidence principale propriétaire',
            )}
          >
            <TypeResidence
              {...{ setSearchParams, situation, answeredQuestions }}
            />
          </Li>
          <Li
            $next={answeredQuestions.includes(
              'logement . résidence principale propriétaire',
            )}
            $touched={answeredQuestions.includes('ménage . région . IdF')}
            key="IdF"
          >
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
            $next={answeredQuestions.includes('ménage . région . IdF')}
            $touched={answeredQuestions.includes('ménage . personnes')}
          >
            <PersonnesQuestion
              {...{
                defaultSituation,
                onChange,
                answeredQuestions,
                situation,
              }}
            />
          </Li>
          <Li
            key="revenu"
            $next={answeredQuestions.includes('ménage . personnes')}
            $touched={answeredQuestions.includes('ménage . revenu')}
          >
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
        <UserData {...{ setSearchParams, situation }} />
        {false && !ampleurQuestionsAnswered(answeredQuestions) ? (
          <section>Vos aides ici</section>
        ) : (
          <section>
            <h2
              css={`
                margin: 0 !important;
              `}
            >
              Parmi vos aides :
            </h2>
            <EvaluationValue {...{ engine, situation }} />
          </section>
        )}
        <section>
          {ampleurQuestionsAnswered(answeredQuestions) && (
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
              <AmpleurCTA {...{ situation: noDefaultSituation }} />
            </CTA>
          )}
        </section>
      </div>
      <FooterModule isMobile={isMobile} />
    </AmpleurWrapper>
  )
}

export const FooterModule = () => {
  const isMobile = useMediaQuery('(max-width: 400px)')
  return (
    <footer
      css={`
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: -1rem;

        p {
          margin: 0;
          margin-left: 1rem;
        }
      `}
    >
      <InternalLink
        href="https://mesaidesreno.beta.gouv.fr"
        css={`
          text-decoration: none;
          color: inherit;
          &:hover {
            background: 0;
          }
          > div {
            @media (max-width: 400px) {
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
      </InternalLink>
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
    </footer>
  )
}
