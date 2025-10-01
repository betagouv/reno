import Feedback from '@/app/contact/Feedback'
import { push } from '@socialgouv/matomo-next'
import BackToLastQuestion from './BackToLastQuestion'
import PersonaBar from './PersonaBar'
import { useAides } from './ampleur/useAides'
import { decodeDottedName, encodeDottedName } from './publicodes/situationUtils'
import useIsInIframe from './useIsInIframe'
import * as iframe from '@/utils/iframe'
import { useEffect, useState } from 'react'
import { getTravauxEnvisages, isCategorieChecked } from './ChoixTravaux'
import AideAmpleur from './ampleur/AideAmpleur'
import AidesAmpleur from './ampleur/AidesAmpleur'
import AideGeste, { getInfoForPrime } from './AideGeste'
import Link from 'next/link'
import DPEScenario from './mpra/DPEScenario'
import Value from './Value'
import { categories, getRulesByCategory } from './utils'
import { AvanceTMO } from './mprg/BlocAideMPR'
import { correspondance } from '@/app/simulation/Form'
import React from 'react'
import Button from '@codegouvfr/react-dsfr/Button'
import Script from 'next/script'

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
  useEffect(() => {
    document.title =
      'Résultats - Vos aides à la rénovation énergétiques disponibles'
    push(['trackEvent', 'Simulateur Principal', 'Page', 'Eligibilité'])
  }, [])

  const isInIframe = useIsInIframe()
  const showPersonaBar = searchParams.personas != null

  useEffect(() => {
    if (isInIframe && sendDataToHost) {
      iframe.postMessageEligibilityDone(consent ? situation : {})
    }
  }, [isInIframe, consent, situation])
  return (
    <>
      <PersonaBar
        startShown={showPersonaBar}
        selectedPersona={searchParams.persona}
        engine={engine}
      />
      <div id="fr-stepper-_r_f_" className="fr-stepper fr-mt-5v">
        <h1 className="fr-stepper__title">
          Mes aides
          <span className="fr-stepper__state">Étape 3 sur 4</span>
        </h1>
        <div
          className="fr-stepper__steps"
          data-fr-current-step="3"
          data-fr-steps="4"
        ></div>
        <p className="fr-stepper__details">
          <span className="fr-text--bold">Étape suivante :</span> Mes démarches
        </p>
      </div>
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
              'Voir les démarches',
            ])
          }}
          title="Voir les démarches"
        >
          Voir les démarches
        </Link>
        {/* <CopyButton searchParams={searchParams} /> */}
      </div>
      <span className="fr-h1">Vos résultats</span>
      {situation["parcours d'aide"] == '"autonomie de la personne"' ? (
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
      ) : (
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
              'Voir les démarches',
            ])
          }}
          title="Voir les démarches"
        >
          Voir les démarches
        </Link>
      </div>
      {isInIframe ? null : <Feedback />}
    </>
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
  const travauxConnus =
    !situation['projet . définition'].includes('travaux inconnus') //beware of " vs ' encoding, it seems that personas use another one that the app. Tricky
  // On doit aussi vérifier geste par geste

  const hasAides =
    aides.filter((aide) => aide.status === true).length > 0 ||
    travauxEnvisages.find((dottedName) => {
      const { infoCEE, infoMPR } = getInfoForPrime({
        engine,
        dottedName: decodeDottedName(dottedName),
        situation,
      })
      return infoCEE?.isEligible || infoMPR?.montantRaw > 0
    })

  const hasMPRA =
    aides.find((a) => a.baseDottedName == 'MPR . accompagnée').status === true
  return (
    <>
      <p>
        {hasAides ? (
          <>
            <span aria-hidden="true">🥳</span> Bonne nouvelle, des aides sont
            disponibles pour vous accompagner dans votre projet.
          </>
        ) : (
          <>Aucune aide disponible ne correspond à votre situation.</>
        )}
      </p>
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
        <div className="fr-callout fr-icon-info-line fr-callout--purple-glycine fr-my-5v">
          {MPRASuspendue ? (
            <>
              <h3 className="fr-callout__title">
                MaPrimeRénov&#39; parcours accompagné est temporairement
                suspendue cet été
              </h3>
              <p className="fr-callout__text">
                Cet été, les demandes pour les rénovations d'ampleur (parcours
                accompagné) sont temporairement suspendues.
              </p>
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
                  🥇 Au moins{' '}
                  <Value
                    {...{
                      engine,
                      situation,
                      dottedName: 'MPR . accompagnée . pourcent dont bonus',
                    }}
                  />{' '}
                  des travaux financés
                </li>
              </ul>
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
            </>
          )}
        </div>
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
        <div className="fr-callout fr-mt-5v">
          <h3 className="fr-callout__title">Et maintenant ?</h3>
          <p className="fr-callout__text">
            Un conseiller France Rénov’ peut vous aider à :
          </p>
          <ul className="fr-callout__text">
            <li>🛠️ Identifier les bons travaux à faire</li>
            <li>💰 Monter un plan de financement adapté</li>
            <li>
              🎯 Accéder aux aides auxquelles vous aurez droit au moment du
              projet
            </li>
          </ul>
        </div>
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
        <h3 className="fr-mt-5v">{category['titre']}</h3>
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
            <AideGeste
              key={travaux}
              {...{
                engine,
                dottedName: decodeDottedName(travaux),
                setSearchParams,
                answeredQuestions,
                situation,
              }}
            />
          ))}
        {category['code'] == 'autres' && (
          <AideGeste
            {...{
              engine,
              dottedName: 'gestes . recommandés . audit',
              setSearchParams,
              answeredQuestions,
              situation,
            }}
          />
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
      <h3 className="fr-mt-5v">{category}</h3>
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
      <div className="fr-callout">
        <h3 className="fr-callout__title">Et maintenant ?</h3>
        <p className="fr-callout__text">
          Un conseiller France Rénov’ peut vous aider à :
        </p>
        <ul className="fr-callout__text">
          <li>🛠️ Identifier les bons travaux à faire</li>
          <li>💰 Monter un plan de financement adapté</li>
          <li>
            🎯 Accéder aux aides auxquelles vous aurez droit au moment du projet
          </li>
        </ul>
      </div>
    </>
  )
}
