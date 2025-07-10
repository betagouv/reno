import Feedback from '@/app/contact/Feedback'
import { No } from '@/components/ResultUI'
import { push } from '@socialgouv/matomo-next'
import BackToLastQuestion from './BackToLastQuestion'
import { CustomQuestionWrapper } from './CustomQuestionUI'
import PersonaBar from './PersonaBar'
import { Badge, Card, CTA, CTAWrapper, Section } from './UI'
import { useAides } from './ampleur/useAides'
import {
  decodeDottedName,
  encodeDottedName,
  encodeSituation,
} from './publicodes/situationUtils'
import useIsInIframe from './useIsInIframe'
import * as iframe from '@/utils/iframe'
import iconFlecheDroiteBlanc from '@/public/fleche-droite-blanc.svg'
import { useEffect, useState } from 'react'
import {
  Accordion,
  getTravauxEnvisages,
  isCategorieChecked,
} from './ChoixTravaux'
import AideAmpleur from './ampleur/AideAmpleur'
import AidesAmpleur from './ampleur/AidesAmpleur'
import Breadcrumb from './Breadcrumb'
import AideGeste from './AideGeste'
import Link from 'next/link'
import DPEScenario from './mpra/DPEScenario'
import Value from './Value'
import informationIcon from '@/public/information.svg'
import Image from 'next/image'
import { categories, getRulesByCategory } from './utils'
import { AvanceTMO } from './mprg/BlocAideMPR'
import { correspondance } from '@/app/simulation/Form'

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
        h2 {
          color: var(--color);
          font-size: 120%;
        }
        h3 {
          font-weight: normal;
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
            align-items: center;
            > div {
              margin: 0;
            }
          `}
        >
          <BackToLastQuestion
            {...{ setSearchParams, situation, answeredQuestions }}
          />
          <CTA $fontSize="normal" $importance="primary">
            <Link
              css={`
                display: flex !important;
                align-items: center;
              `}
              href={setSearchParams({ objectif: 'etape' }, 'url')}
              onClick={() => {
                push([
                  'trackEvent',
                  'Simulateur Principal',
                  'Eligibilité',
                  'Obtenir aides',
                ])
              }}
              title="Obtenir mes aides"
            >
              Obtenir mes aides
              <Image
                css={`
                  margin-left: 0.5rem;
                `}
                src={iconFlecheDroiteBlanc}
                alt="icone fleche droite"
              />
            </Link>
          </CTA>
          {/* <CopyButton searchParams={searchParams} /> */}
        </div>
        <header>
          <h1>Vos résultats</h1>
        </header>
        {situation["parcours d'aide"] == '"rénovation énergétique"' && (
          <EligibilityRenovationEnergetique
            {...{
              engine,
              situation,
              aides: useAides(engine, situation),
              answeredQuestions,
              rules,
              setSearchParams,
              searchParams,
              expanded,
            }}
          />
        )}
        {situation["parcours d'aide"] == '"autonomie de la personne"' && (
          <EligibilityMPA
            {...{
              engine,
              situation,
              aides: useAides(engine, situation, 'autonomie de la personne'),
              answeredQuestions,
              rules,
              setSearchParams,
              searchParams,
            }}
          />
        )}
        <CTAWrapper
          $customCss="
            display: block; 
            > div { 
              width: 100%; 
              a {
                display: flex;
                align-items: center;
                justify-content: center;
              } 
            }
          "
        >
          <CTA $fontSize="normal" $importance="primary">
            <Link
              href={setSearchParams({ objectif: 'etape' }, 'url')}
              onClick={() => {
                push([
                  'trackEvent',
                  'Simulateur Principal',
                  'Eligibilité',
                  'Obtenir aides',
                ])
              }}
              title="Obtenir mes aides"
            >
              Obtenir mes aides
              <Image
                css={`
                  margin-left: 0.5rem;
                `}
                src={iconFlecheDroiteBlanc}
                alt="icone fleche droite"
              />
            </Link>
          </CTA>
        </CTAWrapper>
        {isInIframe ? null : <Feedback />}
      </CustomQuestionWrapper>
    </Section>
  )
}

export function EligibilityRenovationEnergetique({
  engine,
  situation,
  aides,
  answeredQuestions,
  rules,
  setSearchParams,
  searchParams,
  expanded,
}) {
  const [showAllByCategory, setShowAllByCategory] = useState({})
  const handleShowAll = (category) => {
    setShowAllByCategory((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }
  // Il faudra remettre le bloc concerné par cette condition lorsque MPRA sera réactivée
  const MPRASuspendue = true
  const travauxEnvisages = getTravauxEnvisages(situation)
  const travauxConnus = situation['projet . définition'] != '"travaux inconnus"'
  const hasAides = aides.filter((aide) => aide.status === true).length > 0
  const hasMPRA =
    aides.find((a) => a.baseDottedName == 'MPR . accompagnée').status === true
  const rulesByCategory = getRulesByCategory(rules, 'MPR')
  return (
    <>
      <p
        css={`
          margin: 0.5rem 0 !important;
        `}
      >
        {hasMPRA ? (
          <>
            <span aria-hidden="true">🥳</span> Vous êtes éligible aux aides
            présentées ci-dessous :
          </>
        ) : (
          <>
            <span aria-hidden="true">🥳</span> Des prêts et des aides sont
            disponibles pour vos travaux
          </>
        )}
        {!hasAides && (
          <>
            Nous n'avons <No>pas trouvé d'aide</No> à laquelle vous êtes
            éligible.
          </>
        )}
      </p>
      {hasAides && !hasMPRA && (
        <p>
          Si vous n’avez pas encore de plan de travaux, vous pouvez construire
          votre projet avec un conseiller France Rénov’.
        </p>
      )}
      <h2>
        <span aria-hidden="true">💶</span> Aides pour vos travaux
      </h2>
      <AvanceTMO {...{ engine, situation }} />
      {travauxConnus
        ? categories
            .filter(
              (category) =>
                isCategorieChecked(category['code'], situation) ||
                category['code'] == 'autres',
            )
            .map((category) => (
              <div key={category['code']}>
                <h4>{category['titre']}</h4>
                {category['code'] == 'isolation' && (
                  <p>{category['sousTitre']}</p>
                )}
                {travauxEnvisages
                  .filter(
                    (travaux) =>
                      (Object.keys(category.gestes).includes(
                        decodeDottedName(travaux),
                      ) ||
                        (category['code'] == 'isolation' && // Cas particulier pour l'ITE/ITI regrouper sous un même geste
                          travaux.includes(category['code'])) ||
                        (category['code'] == 'chauffage' && // Condition pour éviter que certains gestes "solaire" soit classé en "chauffage"
                          !travaux.includes('solaire') &&
                          travaux.includes(category['code']))) &&
                      rules[decodeDottedName(travaux) + ' . montant'], // Pour éviter qu'on ait la catégorie qui ressorte (ex: gestes . chauffage . PAC)
                  )
                  .map((travaux) => (
                    <div key={travaux}>
                      <AideGeste
                        {...{
                          engine,
                          dottedName: decodeDottedName(travaux),
                          setSearchParams,
                          answeredQuestions,
                          situation,
                        }}
                      />
                    </div>
                  ))}
                {category['code'] == 'autres' && (
                  <div>
                    <AideGeste
                      {...{
                        engine,
                        dottedName: 'gestes . recommandés . audit',
                        setSearchParams,
                        answeredQuestions,
                        situation,
                      }}
                    />
                  </div>
                )}
              </div>
            ))
        : Object.keys(rulesByCategory).map((category) => (
            <div key={category}>
              <h4>{category}</h4>
              <Accordion geste="true">
                {rulesByCategory[category].map((dottedName, index) => {
                  const shouldShow = showAllByCategory[category] || index < 2
                  return (
                    <div key={dottedName}>
                      {shouldShow && (
                        <AideGeste
                          {...{
                            engine,
                            dottedName,
                            setSearchParams,
                            answeredQuestions,
                            situation,
                          }}
                        />
                      )}
                    </div>
                  )
                })}
                {rulesByCategory[category].length > 2 && (
                  <CTAWrapper $justify="center">
                    <CTA
                      $fontSize="normal"
                      $importance="emptyBackground"
                      title="Afficher les aides"
                      onClick={() => handleShowAll(category)}
                    >
                      <span
                        css={`
                          display: flex !important;
                          align-items: center !important;
                        `}
                      >
                        {showAllByCategory[category] ? 'Cacher' : 'Afficher'}{' '}
                        toutes les aides{' '}
                        {categories.find((c) => c.titre == category).suffix}
                      </span>
                    </CTA>
                  </CTAWrapper>
                )}
              </Accordion>
            </div>
          ))}
      {hasMPRA && (
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
          {MPRASuspendue ? (
            <>
              <p>
                <Badge color="blue">
                  <Image
                    src={informationIcon}
                    alt="infobulle"
                    width="20"
                    css={`
                      margin: 0 0.2em 0.2em 0;
                    `}
                  />
                  temporairement suspendue
                </Badge>
              </p>
              <strong>
                MaPrimeRénov' parcours accompagné est temporairement suspendue
                cet été
              </strong>
              <p
                css={`
                  margin: 1rem 0;
                `}
              >
                Cet été, les demandes pour les rénovations d'ampleur (parcours
                accompagné) sont temporairement suspendues.
              </p>
              <div
                css={`
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  color: rgba(0, 0, 145, 0.4);
                  padding-bottom: 1rem;
                  padding-left: 1.5rem;
                  border-bottom: 1px solid var(--lighterColor2);
                `}
              >
                <div>MaPrimeRénov’ pour une rénovation d’ampleur</div>
                <div
                  css={`
                    &::after {
                      content: '';
                      display: inline-block;
                      width: 10px;
                      height: 10px;
                      border-bottom: 2px solid rgba(0, 0, 145, 0.4);
                      border-right: 2px solid rgba(0, 0, 145, 0.4);
                      transform: rotate(45deg);
                      transition: transform 0.3s ease-in-out;
                    }
                  `}
                ></div>
              </div>
            </>
          ) : (
            <>
              <strong>
                {travauxConnus
                  ? 'Avez-vous pensé à une rénovation plus ambitieuse ?'
                  : "Vous êtes éligible à une subvention pour réaliser une rénovation d'ampleur :"}
              </strong>
              <ul>
                <li>📉 Réduction des factures d'énergie</li>
                <li>🧘 Gain de confort hiver comme été</li>
                <li>
                  👷 <strong>Mon accompagnateur rénov'</strong> assure le suivi
                </li>
                <li>
                  🥇 Au moins
                  <Value
                    {...{
                      engine,
                      situation,
                      dottedName: 'MPR . accompagnée . pourcent dont bonus',
                    }}
                  />
                  des travaux financés
                </li>
              </ul>
              <div
                css={`
                  border-bottom: 1px solid var(--lighterColor2);
                  margin-bottom: 1rem;
                  padding-left: 1.5rem;
                  h3 {
                    font-size: 90%;
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
                    addedText: (
                      <DPEScenario
                        {...{
                          rules,
                          engine,
                          situation,
                          setSearchParams,
                          answeredQuestions,
                        }}
                      />
                    ),
                  }}
                />
              </div>
            </>
          )}
        </Card>
      )}
      <AidesAmpleur
        {...{
          setSearchParams,
          situation,
          answeredQuestions,
          engine,
          rules,
          searchParams,
        }}
      />
      {!hasMPRA && (
        <>
          <h4>Et maintenant ?</h4>
          <p>Un conseiller France Rénov’ peut vous aider à :</p>
          <ul
            css={`
              list-style-type: none;
              padding: 0;
              margin-bottom: 2rem;
            `}
          >
            <li>🛠️ Identifier les bons travaux à faire</li>
            <li>💰 Monter un plan de financement adapté</li>
            <li>
              🎯 Accéder aux aides auxquelles vous aurez droit au moment du
              projet
            </li>
          </ul>
        </>
      )}
    </>
  )
}

export function EligibilityMPA({
  engine,
  situation,
  aides,
  answeredQuestions,
  rules,
  setSearchParams,
  searchParams,
}) {
  const hasAides = aides.filter((aide) => aide.status === true).length > 0
  return (
    <>
      <p
        css={`
          margin: 0.5rem 0 !important;
        `}
      >
        {hasAides ? (
          <>
            <span aria-hidden="true">🥳</span> Vous êtes éligible aux aides
            présentées ci-dessous :
          </>
        ) : (
          <>
            Nous n'avons <No>pas trouvé d'aide</No> à laquelle vous êtes
            éligible.
          </>
        )}
      </p>
      <h2>
        <span aria-hidden="true">💶</span> Aides pour vos travaux
      </h2>
      {aides
        .filter((aide) => aide.status === true)
        .map((aide, i) => {
          const AideComponent = correspondance[aide.baseDottedName]
          return (
            <div
              id={'aide-' + encodeDottedName(aide.baseDottedName)}
              key={aide.baseDottedName}
              css={`
                border-bottom: 1px solid var(--lighterColor2);
                margin-bottom: 1rem;
                padding-left: 1.5rem;
              `}
            >
              <AideComponent
                key={aide.baseDottedName}
                {...{
                  isEligible: true,
                  dottedName: aide.baseDottedName,
                  setSearchParams,
                  answeredQuestions,
                  engine,
                  situation,
                  searchParams,
                  rules,
                  expanded: false,
                }}
              />
            </div>
          )
        })}
      <h4>Et maintenant ?</h4>
      <p>Un conseiller France Rénov’ peut vous aider à :</p>
      <ul
        css={`
          list-style-type: none;
          padding: 0;
          margin-bottom: 2rem;
        `}
      >
        <li>🛠️ Identifier les bons travaux à faire</li>
        <li>💰 Monter un plan de financement adapté</li>
        <li>
          🎯 Accéder aux aides auxquelles vous aurez droit au moment du projet
        </li>
      </ul>
    </>
  )
}
