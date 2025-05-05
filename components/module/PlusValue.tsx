'use client'
import { useEffect, useState } from 'react'
import { push } from '@socialgouv/matomo-next'
import useSetSearchParams from '@/components/useSetSearchParams'
import { useSearchParams } from 'next/navigation'
import rules from '@/app/règles/rules'
import listeDepartementRegion from '@/app/règles/liste-departement-region.publicodes'
import Publicodes from 'publicodes'
import dataValeurVerte from '@/data/valeur-verte.csv'
import DPEQuickSwitch from '@/components/dpe/DPEQuickSwitch'
import { encodeDottedName, getSituation } from '../publicodes/situationUtils'
import { getCommune } from '../personas/enrichSituation'
import { ModuleWrapper } from '@/app/module/ModuleWrapper'
import {
  CommuneLogement,
  Dot,
  Li,
  LogementType,
  MontantQuestion,
  QuestionList,
} from '@/app/module/AmpleurQuestions'
import TargetDPETabs from '../mpra/TargetDPETabs'
import DPELabel, { conversionLettreIndex } from '../dpe/DPELabel'
import { EvaluationValueWrapper } from '@/app/module/AmpleurEvaluation'
import { Key } from '../explications/ExplicationUI'
import { formatNumber } from '../RevenuInput'
import { CTA, CTAWrapper } from '../UI'
import AmpleurCTA from '@/app/module/AmpleurCTA'
import PlusValueWidget from '../plusValue/PlusValueWidget'

export default function PlusValueModule({ type }) {
  const engine = new Publicodes(rules)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 400,
  )
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const [region, setRegion] = useState('')
  const [pourcentageAppreciation, setPourcentageAppreciation] = useState(0)
  const [plusValue, setPlusValue] = useState(0)
  const situation = getSituation(searchParams, rules)
  const answeredQuestions = Object.keys(situation)

  // setSearchParams(
  //   encodeSituation({
  //     'DPE . actuel': getIndexLettre(dpe),
  //     'projet . DPE visé': Math.max(getIndexLettre(dpe) - 2, 1),
  //   }),
  // )

  // if (!situation['DPE . actuel']) {
  //   situation['DPE . actuel'] = conversionLettreIndex.indexOf(lettre) + 1

  //   setSearchParams({
  //     [encodeDottedName('DPE . actuel')]: `${situation['DPE . actuel']}*`,
  //   })
  // }

  // if (!situation['projet . DPE visé']) {
  //   setSearchParams({
  //     [encodeDottedName('projet . DPE visé')]:
  //       `${Math.max(situation['DPE . actuel'] - 2, 0)}*`,
  //   })
  // }

  useEffect(() => {
    push(['trackEvent', 'Module', 'Page', 'Module Plus Value'])
  }, [])

  useEffect(() => {
    async function fetchCommune() {
      if (!situation['logement . commune']) return
      const result = await getCommune(situation, 'logement . commune')
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
      <QuestionList>
        <Li
          $next={true}
          $touched={answeredQuestions.includes('logement . type')}
        >
          <LogementType
            {...{
              setSearchParams,
              situation,
              answeredQuestions,
              text: 'Mon logement est ',
            }}
          />
        </Li>
        <Li
          $next={answeredQuestions.includes('logement . type')}
          $touched={answeredQuestions.includes('logement . commune')}
        >
          <CommuneLogement
            {...{
              setSearchParams,
              situation,
              answeredQuestions,
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
        </Li>
        <Li
          $next={answeredQuestions.includes('logement . type')}
          $touched={answeredQuestions.includes("logement . prix d'achat")}
        >
          <MontantQuestion
            {...{
              setSearchParams,
              situation,
              answeredQuestions,
              rule: "logement . prix d'achat",
              text: "Aujourd'hui estimé à",
            }}
          />
        </Li>
        <Li
          $next={answeredQuestions.includes("logement . prix d'achat")}
          $touched={answeredQuestions.includes('DPE . actuel')}
        >
          <Dot />
          <DPEQuickSwitch
            oldIndex={situation['DPE . actuel'] - 1}
            situation={situation}
            columnDisplay={isMobile}
            text={'Et il a une étiquette DPE'}
          />
        </Li>
        {situation['DPE . actuel'] > 2 && (
          <Li
            $next={answeredQuestions.includes('DPE . actuel')}
            $touched={answeredQuestions.includes('projet . DPE visé')}
          >
            <Dot />
            <span
              css={`
                li {
                  margin: 0 !important;
                }
              `}
            >
              <TargetDPETabs
                {...{
                  oldIndex: situation['DPE . actuel'] - 1,
                  setSearchParams,
                  answeredQuestions,
                  choice: Math.max(1, situation['projet . DPE visé'] - 1),
                  engine,
                  situation,
                  columnDisplay: isMobile,
                  text: 'Après les travaux, je vise',
                }}
              />
            </span>
          </Li>
        )}
      </QuestionList>
      <EvaluationValueWrapper $active={plusValue != 0 && !isNaN(plusValue)}>
        <h2
          css={`
            ${isMobile && 'font-size: 105% !important;'}
          `}
        >
          <span aria-hidden="true">💶</span> Après rénovation
          {!isMobile ? ' énergétique' : ''}, mon bien vaudra
          {!isMobile && ' :'}{' '}
        </h2>
        {situation['DPE . actuel'] <= 2 ? (
          <>
            🤔 Nous ne pouvons estimer l'impact d'une rénovation sur les biens
            classés <DPELabel index="0" /> ou <DPELabel index="1" />
          </>
        ) : plusValue != 0 && !isNaN(plusValue) ? (
          <>
            <div
              css={`
                width: 100%;
              `}
            >
              <Key
                $state="prime"
                css={`
                  width: 100%;
                  margin: 0.5rem 0;
                  font-size: 120%;
                  padding: 0.5rem 0;
                `}
              >
                {formatNumber(plusValue)} €
              </Key>
            </div>
            <DPEAppreciationInfo
              {...{
                situation,
                pourcentageAppreciation,
                region,
              }}
            />
          </>
        ) : (
          <>
            🤔 Répondez aux questions pour connaître la valeur verte de votre
            bien
          </>
        )}
        {isNaN(plusValue) && (
          <>
            Nous n'avons pas assez de données concernant ce type de bien pour
            vous proposer une estimation précise.
          </>
        )}
        <CTAWrapper $justify="left" $customCss="margin: 0.5rem auto;">
          <CTA $importance="primary" css="font-size: 100%;">
            <AmpleurCTA
              situation={situation}
              isMobile={isMobile}
              target="_blank"
              text={'Découvrir vos aides à la réno'}
              textMobile={'Découvrir vos aides à la réno'}
            />
          </CTA>
        </CTAWrapper>
      </EvaluationValueWrapper>
      <small
        css={`
          display: inline-block;
          margin-top: 0.5rem;
          @media (max-width: 400px) {
            margin: 0rem;
          }
        `}
      >
        Source:{' '}
        <em>
          <a
            href="https://www.notaires.fr/fr/immobilier-fiscalite/etudes-et-analyses-immobilieres/performance-energetique-la-valeur-verte-des-logements"
            title="Notaires de France"
            target="_blank"
          >
            Notaires de France
          </a>
        </em>
      </small>
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

  // Trouver la ligne correspondante dans dataValeurVerte
  const row = dataValeurVerte.find(
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
    <small>
      En région {region}, {logementType} classé
      {logementType == 'une maison' && 'e'}{' '}
      <DPELabel index={situation['projet . DPE visé'] - 1 || 1} /> a en moyenne
      une valeur <strong>{pourcentageAppreciation.toFixed(1)}%</strong> plus
      élevée qu'un bien classé{' '}
      <DPELabel index={situation['DPE . actuel'] - 1 || 1} />.
    </small>
  )
}
