import Feedback from '@/app/contact/Feedback'
import { No, Yes } from '@/components/ResultUI'
import { push } from '@socialgouv/matomo-next'
import BackToLastQuestion from './BackToLastQuestion'
import CopyButton from './CopyButton'
import { CustomQuestionWrapper } from './CustomQuestionUI'
import FatConseiller from './FatConseiller'
import PersonaBar from './PersonaBar'
import { Section } from './UI'
import AmpleurSummary from './ampleur/AmpleurSummary'
import { useAides } from './ampleur/useAides'
import { Avis } from './explications/Éligibilité'
import { encodeDottedName } from './publicodes/situationUtils'
import useIsInIframe from './useIsInIframe'
import ÀlaCarteSummary from './ÀlaCarteSummary'
import * as iframe from '@/utils/iframe'
import { useEffect } from 'react'

export default function Eligibility({
  setSearchParams,
  situation,
  rules,
  engine,
  answeredQuestions,
  expanded,
  searchParams,
  consent = false,
  sendDataToHost = false,
}) {
  push(['trackEvent', 'Simulateur Principal', 'Page', 'Eligibilité'])
  const isInIframe = useIsInIframe()
  const nextLink = (value) => {
    const url = setSearchParams(
      {
        [encodeDottedName("parcours d'aide")]: `"${encodeDottedName(value)}"*`,
      },
      'url',
      false,
    )
    return url
  }
  const aides = useAides(engine, situation)
  const hasAides = aides.filter((aide) => aide.status === true).length > 0
  const showPersonaBar = searchParams.personas != null

  useEffect(() => {
    if (isInIframe && sendDataToHost) {
      iframe.postMessageEligibilityDone(consent ? situation : {})
    }
  }, [isInIframe, consent, situation])

  return (
    <Section
      css={`
        ${showPersonaBar && `margin-top: 4rem`}
      `}
    >
      <PersonaBar
        startShown={showPersonaBar}
        selectedPersona={searchParams.persona}
        engine={engine}
      />
      <CustomQuestionWrapper>
        <div
          css={`
            display: flex;
            justify-content: space-between;
          `}
        >
          <BackToLastQuestion
            {...{ setSearchParams, situation, answeredQuestions }}
          />
          <CopyButton searchParams={searchParams} />
        </div>
        <header>
          <small>Eligibilité</small>
          <h2
            css={`
              font-size: 120%;
              margin: 0.5rem 0 !important;
            `}
          >
            {hasAides && (
              <>
                Bonne nouvelle <span aria-hidden="true">🥳</span>
              </>
            )}
          </h2>
        </header>
        {hasAides ? (
          <p>
            <Yes>Vous êtes éligible</Yes> aux aides présentées ci-dessous
          </p>
        ) : (
          <p>
            Nous n'avons <No>pas trouvé d'aide</No> à laquelle vous êtes
            éligible.
          </p>
        )}
        <Avis {...{ situation, engine }} />
        <div
          css={`
            display: flex;
            flex-wrap: nowrap;
            > div:nth-child(1),
            > div:nth-child(3) {
              width: 45%;
            }
            > div:nth-child(2) {
              width: 10%;
            }
            @media (max-width: 700px) {
              flex-wrap: wrap;
              flex-direction: column;
              > div {
                width: 100% !important;
              }
            }
            justify-content: center;
          `}
        >
          <AmpleurSummary
            id="parcours-ampleur"
            {...{
              engine,
              url: nextLink('ampleur'),
              situation,
              expanded,
              setSearchParams,
            }}
          />
          <div
            css={`
              padding: 0 1rem;
              align-self: center;
            `}
          >
            <strong
              css={`
                display: block;
                text-align: center;
                margin: 1rem auto;
                font-size: 130%;
              `}
            >
              ou
            </strong>
          </div>
          <ÀlaCarteSummary
            id="parcours-gestes"
            {...{
              engine,
              rules,
              url: nextLink('à la carte'),
              situation,
            }}
          />
        </div>
        <FatConseiller
          {...{
            situation,
            margin: 'small',
            titre:
              'Vous ne savez pas quel parcours choisir pour votre projet ?',
            texte:
              "Un conseiller France Rénov' peut répondre à vos questions et vous guider dans votre choix. C'est 100% gratuit !",
          }}
        />
        {isInIframe ? null : (
          <Feedback title="Avez-vous bien compris les deux parcours d'éligibilité ?" />
        )}
      </CustomQuestionWrapper>
    </Section>
  )
}
