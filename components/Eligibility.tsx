import Feedback from '@/app/contact/Feedback'
import { No } from '@/components/ResultUI'
import { push } from '@socialgouv/matomo-next'
import BackToLastQuestion from './BackToLastQuestion'
import { CustomQuestionWrapper } from './CustomQuestionUI'
import PersonaBar from './PersonaBar'
import { Badge, Card, Section } from './UI'
import { useAides } from './ampleur/useAides'
import { decodeDottedName, encodeDottedName } from './publicodes/situationUtils'
import useIsInIframe from './useIsInIframe'
import * as iframe from '@/utils/iframe'
import { useEffect, useState } from 'react'
import { getTravauxEnvisages, isCategorieChecked } from './ChoixTravaux'
import AideAmpleur from './ampleur/AideAmpleur'
import AidesAmpleur from './ampleur/AidesAmpleur'
import { Breadcrumb } from '@codegouvfr/react-dsfr/Breadcrumb'
import AideGeste from './AideGeste'
import Link from 'next/link'
import DPEScenario from './mpra/DPEScenario'
import Value from './Value'
import informationIcon from '@/public/information.svg'
import Image from 'next/image'
import { categories, getRulesByCategory } from './utils'
import { AvanceTMO } from './mprg/BlocAideMPR'
import { correspondance } from '@/app/simulation/Form'
import React from 'react'
import Button from '@codegouvfr/react-dsfr/Button'

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
        }
      `}
    >
      <PersonaBar
        startShown={showPersonaBar}
        selectedPersona={searchParams.persona}
        engine={engine}
      />
      <section>
        <Breadcrumb
          currentPageLabel="Eligibilité"
          homeLinkProps={{
            href: '/',
          }}
          segments={[]}
        />
        <div
          className="fr-mb-5v"
          css={`
            display: flex;
            justify-content: space-between;
            align-items: center;
          `}
        >
          <BackToLastQuestion
            {...{ setSearchParams, situation, answeredQuestions }}
          />
          <Link
            className="fr-btn fr-icon-arrow-right-line fr-btn--icon-right"
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
          </Link>
          {/* <CopyButton searchParams={searchParams} /> */}
        </div>
        <h1>Vos résultats</h1>
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
        <div className="fr-my-5v">
          <Link
            className="fr-btn fr-icon-arrow-right-line fr-btn--icon-right"
            css={`
              width: 100%;
              justify-content: center;
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
          </Link>
        </div>
        {isInIframe ? null : <Feedback />}
      </section>
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
  // Il faudra remettre le bloc concerné par cette condition lorsque MPRA sera réactivée
  const MPRASuspendue = true
  const travauxEnvisages = getTravauxEnvisages(situation)
  const travauxConnus = situation['projet . définition'] != '"travaux inconnus"'
  const hasAides = aides.filter((aide) => aide.status === true).length > 0
  const hasMPRA =
    aides.find((a) => a.baseDottedName == 'MPR . accompagnée').status === true
  return (
    <>
      <p>
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
      {travauxConnus ? (
        <TravauxConnus
          {...{
            categories,
            situation,
            travauxEnvisages,
            rules,
            answeredQuestions,
            engine,
            setSearchParams,
          }}
        />
      ) : (
        <TravauxInconnus
          {...{
            categories,
            situation,
            rules,
            answeredQuestions,
            engine,
            setSearchParams,
          }}
        />
      )}
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
          <h3>Et maintenant ?</h3>
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

export function TravauxConnus({
  categories,
  situation,
  travauxEnvisages,
  rules,
  answeredQuestions,
  engine,
  setSearchParams,
}) {
  return categories
    .filter(
      (c) => isCategorieChecked(c['code'], situation) || c['code'] == 'autres',
    )
    .map((category) => (
      <div key={category['code']}>
        <h3>{category['titre']}</h3>
        {category['code'] == 'isolation' && <p>{category['sousTitre']}</p>}
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
}

export function TravauxInconnus({
  categories,
  situation,
  rules,
  answeredQuestions,
  engine,
  setSearchParams,
}) {
  const [showAllByCategory, setShowAllByCategory] = useState({})
  const handleShowAll = (category) => {
    setShowAllByCategory((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }
  const rulesByCategory = getRulesByCategory(rules, 'MPR')
  return Object.keys(rulesByCategory).map((category) => (
    <div key={category}>
      <h4 className="fr-mt-5v">{category}</h4>
      {rulesByCategory[category].map((dottedName, index) => {
        const shouldShow = showAllByCategory[category] || index < 2
        return (
          shouldShow && (
            <div key={dottedName}>
              <AideGeste
                {...{
                  engine,
                  dottedName,
                  setSearchParams,
                  answeredQuestions,
                  situation,
                }}
              />
            </div>
          )
        )
      })}
      {rulesByCategory[category].length > 2 && (
        <div
          className="fr-m-3v"
          css={`
            text-align: center;
          `}
        >
          <Button
            priority="secondary"
            title="Afficher les aides"
            onClick={() => handleShowAll(category)}
          >
            {showAllByCategory[category] ? 'Cacher' : 'Afficher'} toutes les
            aides {categories.find((c) => c.titre == category).suffix}
          </Button>
        </div>
      )}
    </div>
  ))
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
  let lastStatus = false
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
            Nous n’avons trouvé aucune aide spécifique pour les critères que
            vous avez renseignés. N'hésitez pas à contacter l’un de nos
            conseillers France Rénov’ pour obtenir des conseils personnalisés.
          </>
        )}
      </p>
      {hasAides && (
        <h2>
          <span aria-hidden="true">💶</span> Aides pour vos travaux
        </h2>
      )}
      {aides
        .sort((a, b) => {
          if (a.status === b.status) return 0
          if (a.status === true) return -1
          if (b.status === true) return 1
          if (a.status === null) return -1
          if (b.status === null) return 1
          return 0
        })
        .map((aide, i) => {
          const currentStatus = aide.status
          const updatedLastStatus = lastStatus
          lastStatus = currentStatus
          const AideComponent = correspondance[aide.baseDottedName]
          return (
            <React.Fragment key={i}>
              {aide.status === null && updatedLastStatus !== null && (
                <h2>
                  <span aria-hidden="true">🏦</span> Autres aides
                  complémentaires
                </h2>
              )}
              {aide.status === false && updatedLastStatus !== false && (
                <h2>
                  <span aria-hidden="true">⛔</span> Non éligible
                </h2>
              )}
              <div
                id={'aide-' + encodeDottedName(aide.baseDottedName)}
                key={aide.baseDottedName}
                css={`
                  border-bottom: 1px solid var(--lighterColor2);
                  margin-bottom: 1rem;
                  padding-left: 1.5rem;
                  h3 {
                    font-size: 90%;
                  }
                `}
              >
                <AideComponent
                  key={aide.baseDottedName}
                  {...{
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
            </React.Fragment>
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
