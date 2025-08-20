'use client'
import { useEffect, useState } from 'react'
import { push } from '@socialgouv/matomo-next'
import useSetSearchParams from '@/components/useSetSearchParams'
import { useSearchParams } from 'next/navigation'
import rules from '@/app/règles/rules'
import listeDepartementRegion from '@/app/règles/liste-departement-region.publicodes'
import Publicodes from 'publicodes'
import dataPlusValue from '@/data/valeur-verte.csv'
import { encodeDottedName, getSituation } from '../publicodes/situationUtils'
import { getCommune } from '../personas/enrichSituation'
import { ModuleWrapper } from '@/app/module/ModuleWrapper'
import {
  CommuneLogement,
  LogementType,
  MontantQuestion,
} from '@/app/module/AmpleurQuestions'
import TargetDPETabs from '../mpra/TargetDPETabs'
import DPELabel, { conversionLettreIndex } from '../dpe/DPELabel'
import { formatNumber } from '../RevenuInput'
import AmpleurCTA from '@/app/module/AmpleurCTA'
import PlusValueWidget from '../plusValue/PlusValueWidget'
import DPEQuickSwitch from '../dpe/DPEQuickSwitch'
import Badge from '@codegouvfr/react-dsfr/Badge'
import useIsMobile from '../useIsMobile'

export default function PlusValueModule({ type }) {
  const engine = new Publicodes(rules)
  const isMobile = useIsMobile(400)
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const [region, setRegion] = useState('')
  const [pourcentageAppreciation, setPourcentageAppreciation] = useState(0)
  const [plusValue, setPlusValue] = useState(0)
  const situation = getSituation(searchParams, rules)
  const answeredQuestions = Object.keys(situation)

  useEffect(() => {
    push(['trackEvent', 'Module', 'Page', 'Module Plus Value'])
  }, [])

  useEffect(() => {
    async function fetchCommune() {
      if (!situation['logement . commune']) return
      const result = await getCommune(situation, 'logement . commune')
      push(['trackEvent', 'Module', 'Interaction', 'Commune logement'])
      setSearchParams({
        [encodeDottedName('logement . code département')]:
          `"${result.codeDepartement}"*`,
      })
    }
    fetchCommune()
  }, [situation['logement . commune']])

  useEffect(() => {
    const result = calculateAppreciationAndPlusValue(situation)
    if (result) {
      push(['trackEvent', 'Module', 'Interaction', 'Affiche Resultat'])
      setRegion(result.region)
      setPourcentageAppreciation(result.appreciation)
      setPlusValue(result.plusValue)
    }
  }, [situation])

  return type == 'module' ? (
    <ModuleWrapper
      isMobile={isMobile}
      title="Après rénovation, combien vaudra mon bien ?"
    >
      <form id="plus-value">
        <LogementType
          {...{
            setSearchParams,
            situation,
            answeredQuestions,
            text: 'Mon logement est :',
          }}
        />
        <div className="fr-input-group">
          <CommuneLogement
            {...{
              situation,
              disabled: !answeredQuestions.includes('logement . type'),
              text: 'Il est situé à',
              onChange: (result) => {
                setSearchParams({
                  [encodeDottedName('logement . commune')]: `"${result.code}"*`,
                  [encodeDottedName('logement . commune . nom')]:
                    `"${result.nom}"*`,
                })
              },
            }}
          />
        </div>
        <MontantQuestion
          {...{
            setSearchParams,
            situation,
            answeredQuestions,
            rule: "logement . prix d'achat",
            text: "Aujourd'hui estimé à",
            disabled: !answeredQuestions.includes('logement . type'),
          }}
        />
        <DPEQuickSwitch
          oldIndex={situation['DPE . actuel'] - 1}
          situation={situation}
          columnDisplay={isMobile}
          disabled={!answeredQuestions.includes("logement . prix d'achat")}
          text={'Il a une étiquette DPE'}
        />
        {situation['DPE . actuel'] > 2 && (
          <TargetDPETabs
            {...{
              disabled: !answeredQuestions.includes('DPE . actuel'),
              oldIndex: situation['DPE . actuel'] - 1,
              setSearchParams,
              answeredQuestions,
              choice: Math.max(1, situation['projet . DPE visé'] - 1),
              engine,
              situation,
              columnDisplay: isMobile,
              text: 'Après les travaux, je vise :',
            }}
          />
        )}
      </form>
      <div
        className={`fr-mt-5v fr-callout fr-callout--${plusValue != 0 && !isNaN(plusValue) ? 'blue-cumulus' : 'yellow-moutarde'}`}
      >
        <h2 className="fr-callout__title">
          <span aria-hidden="true">💶</span> Après rénovation
          {!isMobile ? ' énergétique' : ''}, mon bien vaudra :
        </h2>
        {situation['DPE . actuel'] <= 2 ? (
          <p className="fr-callout__text">
            🤔 Nous ne pouvons estimer l'impact d'une rénovation sur les biens
            classés <DPELabel index="0" /> ou <DPELabel index="1" />
          </p>
        ) : plusValue != 0 && !isNaN(plusValue) ? (
          <>
            <Badge
              noIcon
              severity="success"
              className="fr-display--xs fr-my-5v"
              style={{ display: 'block', margin: 'auto' }}
            >
              {formatNumber(plusValue)} €
            </Badge>
            <p className="fr-hint-text fr-mb-0">
              <DPEAppreciationInfo
                {...{
                  situation,
                  pourcentageAppreciation,
                  region,
                }}
              />
            </p>
          </>
        ) : (
          <p className="fr-callout__text">
            🤔 Répondez aux questions pour connaître la valeur verte de votre
            bien
          </p>
        )}
        {isNaN(plusValue) && (
          <p className="fr-callout__title">
            Nous n'avons pas assez de données concernant ce type de bien pour
            vous proposer une estimation précise.
          </p>
        )}
        <AmpleurCTA
          situation={situation}
          isMobile={isMobile}
          target="_blank"
          text={'Découvrir vos aides à la réno'}
          textMobile={'Découvrir vos aides à la réno'}
        />
      </div>
      <p className="fr-hint-text">
        Source :{' '}
        <a
          rel="noopener external"
          className="fr-link fr-hint-text"
          href="https://www.notaires.fr/fr/immobilier-fiscalite/etudes-et-analyses-immobilieres/performance-energetique-la-valeur-verte-des-logements"
          title="Notaires de France"
          target="_blank"
        >
          Notaires de France, étude 2024 (données 2023)
        </a>
      </p>
    </ModuleWrapper>
  ) : (
    <PlusValueWidget
      {...{
        situation,
        setSearchParams,
        answeredQuestions,
        isMobile,
        plusValue,
        pourcentageAppreciation,
        region,
      }}
    />
  )
}

export const hasResult = (situation) =>
  situation['logement . code département'] &&
  situation['logement . type'] &&
  situation["logement . prix d'achat"]

const calculateAppreciationAndPlusValue = (situation) => {
  if (!hasResult(situation)) return null

  // Règle spécifique pour paris et la petite couronne qui ne sont pas réellement des régions
  const departmentCode = parseInt(situation['logement . code département'])
  let region = null
  if (departmentCode === 75) {
    region = 'Paris'
  } else if ([92, 93, 94].includes(departmentCode)) {
    region = 'Île-de-France - Petite Couronne'
  } else {
    const codeRegion =
      listeDepartementRegion['départements']['valeurs'][
        situation['logement . code département'].replaceAll('"', '')
      ].codeRegion

    region = listeDepartementRegion['régions']['valeurs'][codeRegion]
  }

  // Trouver la ligne correspondante dans dataPlusValue
  const row = dataPlusValue.find(
    (r) => r.Région === region && situation['logement . type'].includes(r.Type),
  )

  if (!row) return null

  const getPourcentage = (key) => {
    if (situation[key] == 4) return 0 // Le DPE D est la référence donc 0

    const col = Object.keys(row).find((c) =>
      c.includes(conversionLettreIndex[situation[key] - 1]),
    )

    return row[col]
      ? row[col]
          .replaceAll('%', '')
          .split(' à ')
          .reduce((p, c) => p + parseFloat(c), 0) / 2
      : 'error'
  }

  const pourcentageDpeActuel = getPourcentage('DPE . actuel')
  const pourcentageDpeVise = getPourcentage('projet . DPE visé')

  if (pourcentageDpeActuel === 'error' || pourcentageDpeVise === 'error') {
    return null
  }

  const appreciation =
    ((100 + pourcentageDpeVise - (100 + pourcentageDpeActuel)) /
      (100 + pourcentageDpeActuel)) *
    100

  const plusValue = Math.round(
    situation["logement . prix d'achat"] * (1 + appreciation / 100),
  )

  return { appreciation, plusValue, region }
}

export const DPEAppreciationInfo = ({
  situation,
  pourcentageAppreciation,
  region,
}) => {
  if (!situation['logement . type'] || pourcentageAppreciation == null)
    return null

  const logementType = situation['logement . type'].includes('appartement')
    ? 'un appartement'
    : 'une maison'

  return (
    <>
      En région {region}, {logementType} classé
      {logementType == 'une maison' && 'e'}{' '}
      <DPELabel index={situation['projet . DPE visé'] - 1 || 1} /> a en moyenne
      une valeur <strong>{pourcentageAppreciation.toFixed(1)}%</strong> plus
      élevée qu'un bien classé{' '}
      <DPELabel index={situation['DPE . actuel'] - 1 || 1} />.
    </>
  )
}
