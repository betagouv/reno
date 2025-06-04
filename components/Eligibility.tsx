import Feedback from '@/app/contact/Feedback'
import { No } from '@/components/ResultUI'
import { push } from '@socialgouv/matomo-next'
import BackToLastQuestion from './BackToLastQuestion'
import CopyButton from './CopyButton'
import { CustomQuestionWrapper } from './CustomQuestionUI'
import FatConseiller from './FatConseiller'
import PersonaBar from './PersonaBar'
import { Card, Section } from './UI'
import AmpleurSummary from './ampleur/AmpleurSummary'
import { useAides } from './ampleur/useAides'
import { Avis } from './explications/Éligibilité'
import {
  decodeDottedName,
  encodeDottedName,
  encodeSituation,
} from './publicodes/situationUtils'
import useIsInIframe from './useIsInIframe'
import ÀlaCarteSummary from './ÀlaCarteSummary'
import * as iframe from '@/utils/iframe'
import { useEffect, useState } from 'react'
import { getTravauxEnvisages, isCategorieChecked } from './ChoixTravaux'
import AideAmpleur, { aideTitle, PrimeWithLabel } from './ampleur/AideAmpleur'
import { correspondance } from '@/app/simulation/Form'
import AidesAmpleur from './ampleur/AidesAmpleur'
import Breadcrumb from './Breadcrumb'
import AideGeste from './AideGeste'

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
  const [isOpen, setIsOpen] = useState(false)
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

  const travauxEnvisages = getTravauxEnvisages(situation)
  console.log('travauxEnvisages', travauxEnvisages)

  useEffect(() => {
    if (isInIframe && sendDataToHost) {
      iframe.postMessageEligibilityDone(consent ? situation : {})
    }
  }, [isInIframe, consent, situation])

  return (
    <Section
      css={`
        ${showPersonaBar && `margin-top: 4rem`}
        h2 {
          color: var(--color);
          font-size: 120%;
        }
      `}
    >
      <PersonaBar
        startShown={showPersonaBar}
        selectedPersona={searchParams.persona}
        engine={engine}
      />
      <CustomQuestionWrapper>
        <Breadcrumb
          links={[
            {
              Eligibilité: setSearchParams(
                {
                  ...encodeSituation(situation, false, answeredQuestions),
                },
                'url',
                true,
              ),
            },
          ]}
        />
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
          <p
            css={`
              font-weight: bold;
              margin: 0.5rem 0 !important;
            `}
          >
            {hasAides ? (
              <>
                <span aria-hidden="true">🥳</span> Vous êtes éligible aux aides
                présentées ci-dessous
              </>
            ) : (
              <>
                Nous n'avons <No>pas trouvé d'aide</No> à laquelle vous êtes
                éligible.
              </>
            )}
          </p>
        </header>
        {/* <Avis {...{ situation, engine }} /> */}
        <h2>
          <span aria-hidden="true">💶</span> Aides pour vos travaux
        </h2>
        {isCategorieChecked('isolation', travauxEnvisages) && (
          <h4>
            Isolation thermique
            <small
              css={`
                display: block;
                font-weight: normal;
              `}
            >
              Murs, toit, plancher, portes et fenêtres
            </small>
          </h4>
        )}
        {travauxEnvisages
          .filter((travaux) => travaux.includes('isolation'))
          .map((travaux) => {
            return (
              <AideGeste
                {...{
                  engine,
                  dottedName: decodeDottedName(travaux),
                  setSearchParams,
                  answeredQuestions,
                  situation,
                }}
              />
            )
          })}
        <Card
          css={`
            background: #f4efff;
            padding: calc(0.5rem + 1vw);
            > strong {
              font-size: 120%;
            }
            ul {
              list-style-type: none;
              padding: 1rem 0;
              li {
                padding: 0.2rem 0;
              }
            }
          `}
        >
          <strong>Avez-vous pensé à une rénovation plus ambitieuse ?</strong>
          <ul>
            <li>📉 Réduction des factures d'énergie</li>
            <li>🧘 Gain de confort hiver comme été</li>
            <li>
              👷 <strong>Mon accompagnateur rénov'</strong> assure le suivi
            </li>
            <li>
              🥇 Au moins <strong>60%</strong> des travaux financés
            </li>
          </ul>
          <div
            css={`
              border-bottom: 1px solid var(--lighterColor2);
              margin-bottom: 1rem;
              padding-left: 1.5rem;
              h3 {
                font-size: 100%;
              }
            `}
          >
            <AideAmpleur
              {...{
                isEligible: false,
                engine,
                dottedName: 'MPR . accompagnée',
                setSearchParams,
                situation,
                answeredQuestions,
                expanded,
              }}
            />
          </div>
        </Card>
        <AidesAmpleur
          {...{
            setSearchParams,
            situation,
            answeredQuestions,
            engine,
            rules,
            searchParams,
            correspondance,
          }}
        />
        {/* <div
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
        /> */}
        {isInIframe ? null : (
          <Feedback title="Ce simulateur a-t-il été utile ?" />
        )}
      </CustomQuestionWrapper>
    </Section>
  )
}
