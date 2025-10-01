import Feedback from '@/app/contact/Feedback'
import { push } from '@socialgouv/matomo-next'
import BackToLastQuestion from './BackToLastQuestion'
import PersonaBar from './PersonaBar'
import { useAides } from './ampleur/useAides'
import { decodeDottedName } from './publicodes/situationUtils'
import useIsInIframe from './useIsInIframe'
import * as iframe from '@/utils/iframe'
import { useEffect, useState } from 'react'
import { getTravauxEnvisages, isCategorieChecked } from './ChoixTravaux'
import AideAmpleur from './ampleur/AideAmpleur'
import AideGeste, { getInfoForPrime } from './AideGeste'
import Link from 'next/link'
import Value from './Value'
import { categories, getRulesByCategory } from './utils'
import { AvanceTMO } from './mprg/BlocAideMPR'
import { correspondance } from '@/app/simulation/Form'
import React from 'react'
import Button from '@codegouvfr/react-dsfr/Button'
import Share from '@/app/simulation/Share'
import styled from 'styled-components'

export default function Eligibility({
  nbStep,
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
  const aides = useAides(engine, situation)

  // On doit aussi vérifier geste par geste
  const travauxEnvisages = getTravauxEnvisages(situation)
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
      />
      <div id="fr-stepper-_r_f_" className="fr-stepper fr-mt-5v">
        <h1 className="fr-stepper__title">
          Mes aides
          <span className="fr-stepper__state">
            Étape {nbStep - 1} sur {nbStep}
          </span>
        </h1>
        <div
          className="fr-stepper__steps"
          data-fr-current-step={nbStep - 1}
          data-fr-steps={nbStep}
        ></div>
        <p className="fr-stepper__details">
          <span className="fr-text--bold">Étape suivante :</span> Mes démarches
        </p>
      </div>
      <BlocEtMaintenant
        title={
          <>
            <span className="fr-icon-flag-line" aria-hidden="true"></span>Psst !
            La simulation n’est pas terminée...
          </>
        }
        setSearchParams={setSearchParams}
      >
        <p className="fr-callout__text">
          Le service public vous accompagne : parlez à un conseiller France
          Rénov'
        </p>
      </BlocEtMaintenant>
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
      {situation["parcours d'aide"] == '"autonomie"' ? (
        <EligibilityMPA
          {...{
            engine,
            situation,
            aides,
            answeredQuestions,
            rules,
            setSearchParams,
            searchParams,
          }}
        />
      ) : situation["parcours d'aide"] == '"sécurité salubrité"' ? (
        <EligibilityMPLD
          {...{
            engine,
            situation,
            aides,
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
            aides,
            travauxEnvisages,
            answeredQuestions,
            rules,
            setSearchParams,
            searchParams,
            expanded,
          }}
        />
      )}
      <BlocEtMaintenant
        title="Et maintenant, on fait quoi ?"
        setSearchParams={setSearchParams}
      >
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
      </BlocEtMaintenant>
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
          title="Continuer vers les démarches"
        >
          Continuer vers les démarches
        </Link>
      </div>
      {isInIframe ? null : <Feedback />}
    </>
  )
}

export function EligibilityRenovationEnergetique({
  engine,
  situation,
  travauxEnvisages,
  aides,
  answeredQuestions,
  rules,
  setSearchParams,
  searchParams,
  expanded,
}) {
  const travauxConnus = situation['projet . définition'] != '"travaux inconnus"'

  const hasMPRA =
    aides.find((a) => a.baseDottedName == 'MPR . accompagnée')?.status === true

  const isTMO =
    engine.setSituation(situation).evaluate('ménage . revenu . classe')
      .nodeValue == 'très modeste'

  // On filtre les remboursements (donc MPRA, aide locales et subvention MAR) car ils sont affichés différement sauf CEE . ampleur
  const eligibles = aides.filter(
    (aide) =>
      (aide.status === true || aide.status === null) &&
      (aide.type !== 'remboursement' ||
        aide.baseDottedName == "CEE . rénovation d'ampleur"),
  )
  const nonEligibles = aides.filter((aide) => aide.status === false)
  return (
    <>
      {eligibles.length > 0 && (
        <Card>
          <h2 className="fr-h4">
            <span aria-hidden="true">🏦</span> Aides de financement
          </h2>
          <RenderAides
            {...{
              isEligible: true,
              aidesList: eligibles,
              setSearchParams,
              answeredQuestions,
              engine,
              situation,
              searchParams,
              rules,
            }}
          />
        </Card>
      )}
      <Card>
        <h2 className="fr-h4">
          <span aria-hidden="true">💶</span> Aides pour vos travaux
        </h2>
        {hasMPRA && (
          <>
            <div className="fr-callout fr-callout--purple-glycine fr-my-5v">
              <div className="fr-callout__title">
                {travauxConnus
                  ? 'Avez-vous pensé à une rénovation plus ambitieuse ?'
                  : "Vous êtes éligible à une subvention pour réaliser une rénovation d'ampleur :"}
              </div>
              <ul className="fr-callout__text">
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
                      dottedName: 'MPR . accompagnée . pourcent',
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
              <div className="fr-alert fr-alert--info">
                <div className="fr-alert__title">
                  Qui peut avoir MaPrimeRénov’ parcours accompagné ?
                </div>
                <p>
                  Aujourd’hui, seuls les ménages très modestes peuvent en
                  bénéficier. L’aide pourrait s’ouvrir aux autres revenus d’ici
                  fin 2025. Revenez régulièrement, le simulateur sera mis à
                  jour.
                  <Share text="" showWithAnswer={false} align="left" />
                </p>
              </div>
            </div>
            <p>OU optez pour les aides par gestes individuels :</p>
          </>
        )}
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
      </Card>
      {nonEligibles.length > 0 && (
        <Card>
          <h2 className="fr-h4">
            <span aria-hidden="true">⛔</span> Non éligible à
          </h2>
          <RenderAides
            {...{
              isEligible: false,
              aidesList: nonEligibles,
              setSearchParams,
              answeredQuestions,
              engine,
              situation,
              searchParams,
              rules,
              hardCodedFilter: (aide) =>
                situation['logement . type'] === '"maison"' &&
                aide.baseDottedName ===
                  'ampleur . prime individuelle copropriété'
                  ? false
                  : true,
            }}
          />
        </Card>
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
  let lastStatus = false
  return (
    <>
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
                <h2 className="fr-mt-5v">
                  <span aria-hidden="true">🏦</span> Autres aides
                  complémentaires
                </h2>
              )}
              {aide.status === false && updatedLastStatus !== false && (
                <h2 className="fr-mt-5v">
                  <span aria-hidden="true">⛔</span> Non éligible
                </h2>
              )}
              <div>
                <AideComponent
                  key={aide.baseDottedName}
                  {...{
                    isEligible: aide.status,
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
    </>
  )
}

export function EligibilityMPLD({
  engine,
  situation,
  aides,
  answeredQuestions,
  rules,
  setSearchParams,
  searchParams,
}) {
  return (
    <>
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
          lastStatus = currentStatus
          const AideComponent = correspondance[aide.baseDottedName]
          return (
            <React.Fragment key={i}>
              {aide.status === null && (
                <h2 className="fr-mt-5v">
                  <span aria-hidden="true">🏦</span> Autres aides
                  complémentaires
                </h2>
              )}
              {aide.status === false && (
                <h2 className="fr-mt-5v">
                  <span aria-hidden="true">⛔</span> Non éligible
                </h2>
              )}
              <div>
                <AideComponent
                  key={aide.baseDottedName}
                  {...{
                    isEligible: aide.status,
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
    </>
  )
}

export function RenderAides({
  setSearchParams,
  answeredQuestions,
  engine,
  situation,
  searchParams,
  aidesList,
  isEligible,
  rules,
  hardCodedFilter = () => true,
}) {
  if (aidesList.length === 0) return null
  return aidesList.filter(hardCodedFilter).map((aide, i) => {
    const AideComponent = correspondance[aide.baseDottedName]
    return (
      <AideComponent
        key={aide.baseDottedName}
        {...{
          isEligible,
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
    )
  })
}

export const BlocEtMaintenant = ({ children, title, setSearchParams }) => (
  <div className="fr-callout fr-mt-5v">
    <h3 className="fr-callout__title">{title}</h3>
    {children}
    <div className="fr-grid-row fr-grid-row--gutters">
      <div className="fr-col-12 fr-col-md-6">
        <Link
          className="fr-btn fr-icon-arrow-right-line fr-btn--icon-right"
          style={{ width: '100%', justifyContent: 'center' }}
          href={setSearchParams({ objectif: 'etape' }, 'url')}
          onClick={() => {
            push([
              'trackEvent',
              'Simulateur Principal',
              'Eligibilité',
              'trouver conseiller',
            ])
          }}
          title="Continuer un conseiller (gratuit)"
        >
          Contacter un conseiller (gratuit)
        </Link>
      </div>
      <div className="fr-col-12 fr-col-md-6">
        <Share
          text=""
          showWithAnswer={false}
          customCss={{ width: '100%', justifyContent: 'center' }}
        />
      </div>
    </div>
  </div>
)

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
        <h3 className="fr-mt-5v fr-h5">{category['titre']}</h3>
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
      <h3 className="fr-mt-5v fr-h5">{category}</h3>
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
        <div className="fr-m-3v">
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

export const Card = styled.div`
  border: 1px solid rgba(207, 207, 207, 1);
  box-shadow: 0px 4px 4px 0px rgba(221, 221, 221, 1);
  padding: 1rem;
  margin-bottom: 2rem;
`
