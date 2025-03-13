'use client'
import { useEffect, useState } from 'react'
import { push } from '@socialgouv/matomo-next'
import useSetSearchParams from '@/components/useSetSearchParams'
import { useSearchParams } from 'next/navigation'
import rules from '@/app/règles/rules'
import listeDepartementRegion from '@/app/règles/liste-departement-region.publicodes'
import Publicodes from 'publicodes'
import dataValeurVerte from '@/data/valeur-verte.csv'
import DPEQuickSwitch from '@/components/DPEQuickSwitch'
import { encodeDottedName, getSituation } from '../publicodes/situationUtils'
import { getCommune } from '../personas/enrichSituation'
import { ModuleWrapper } from '@/app/module/ModuleWrapper'
import {
  CommuneLogement,
  Li,
  LogementType,
  MontantQuestion,
  QuestionList,
} from '@/app/module/AmpleurQuestions'
import TargetDPETabs from '../mpra/TargetDPETabs'
import DPELabel, { conversionLettreIndex } from '../DPELabel'
import { EvaluationValueWrapper } from '@/app/module/AmpleurEvaluation'
import { Key } from '../explications/ExplicationUI'
import { formatNumber } from '../RevenuInput'
import { CTA, CTAWrapper } from '../UI'
import AmpleurCTA from '@/app/module/AmpleurCTA'

export default function ValeurVerteModule() {
  const engine = new Publicodes(rules)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 600,
  )
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const [pourcentageAppreciation, setPourcentageAppreciation] = useState(0)
  const [plusValue, setPlusValue] = useState(0)
  const situation = getSituation(searchParams, rules)
  const answeredQuestions = Object.keys(situation)

  if (!situation['projet . DPE visé']) {
    setSearchParams({
      [encodeDottedName('projet . DPE visé')]:
        `${Math.max(situation['DPE . actuel'] - 2, 0)}*`,
    })
  }

  useEffect(() => {
    push(['trackEvent', 'Module', 'Page', 'Module Valeur Verte'])
  }, [])

  useEffect(() => {
    async function fetchCommune() {
      const result = await getCommune(situation, 'logement . commune')
      setSearchParams({
        [encodeDottedName('logement . code département')]:
          `"${result.codeDepartement}"*`,
      })
    }
    fetchCommune()
  }, [situation['logement . commune']])

  useEffect(() => {
    if (!situation['logement . code département']) return
    let region = null
    // Règle spécifique pour la petite couronne qui n'est pas réellement une région
    if (75 == parseInt(situation['logement . code département'])) {
      region = 'Paris'
    } else if (
      [92, 93, 94].includes(parseInt(situation['logement . code département']))
    ) {
      region = 'Île-de-France - Petite Couronne'
    } else {
      const codeRegion =
        listeDepartementRegion['départements']['valeurs'][
          situation['logement . code département'].replaceAll('"', '')
        ].codeRegion
      region = listeDepartementRegion['régions']['valeurs'][codeRegion]
    }
    // on teste avec includes pour éviter les problèmes d'apostrophes/guillemet
    const row = dataValeurVerte.find((r) => r.Région === region && situation['logement . type'].includes(r.Type))
    if (!row) return

    const getPourcentage = (key) => {
      if(situation[key] == 4) // Le DPE D est la référence donc 0
        return 0

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

    const appreciation =
      ((100 + pourcentageDpeVise - (100 + pourcentageDpeActuel)) /
        (100 + pourcentageDpeActuel)) *
      100

    setPourcentageAppreciation(appreciation)
    setPlusValue(
      Math.round(
        situation["logement . prix d'achat"] * (1 + appreciation / 100) -
          situation["logement . prix d'achat"],
      ),
    )
  }, [situation])

  return (
    <ModuleWrapper
      isMobile={isMobile}
      title="Quelle est la valeur verte du logement ?"
    >
      <QuestionList>
        <Li
          $next={true}
          $touched={answeredQuestions.includes('logement . commune')}
        >
          <CommuneLogement
            {...{
              setSearchParams,
              situation,
              answeredQuestions,
              text: 'Ce logement est situé à',
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
          $next={answeredQuestions.includes('logement . commune')}
          $touched={answeredQuestions.includes('logement . type')}
        >
          <LogementType
            {...{
              setSearchParams,
              situation,
              answeredQuestions,
              text: "Il s'agit ",
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
              text: 'Proposé au prix de : ',
            }}
          />
        </Li>
        <Li
          $next={answeredQuestions.includes("logement . prix d'achat")}
          $touched={answeredQuestions.includes('DPE . actuel')}
        >
          <DPEQuickSwitch
            oldIndex={situation['DPE . actuel'] - 1}
            situation={situation}
            isMobile={isMobile}
            text={'Ayant une étiquette'}
          />
        </Li>
        <Li
          $next={answeredQuestions.includes('DPE . actuel')}
          $touched={answeredQuestions.includes('projet . DPE visé')}
        >
          <TargetDPETabs
            {...{
              oldIndex: situation['DPE . actuel'] - 1,
              setSearchParams,
              answeredQuestions,
              choice: situation['projet . DPE visé'] - 1,
              engine,
              situation,
              isMobile,
              text: 'En visant une étiquette',
            }}
          />
        </Li>
      </QuestionList>
      <EvaluationValueWrapper $active={plusValue != 0 && !isNaN(plusValue)}>
        <h2>💶 Plus-value estimée 💶</h2>
        {plusValue != 0 &&
          !isNaN(plusValue) && (
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
              <small>
                Dans votre région, la valeur {situation['logement . type'].includes("appartement") ? "d'un appartement": "d'une maison"} classé{' '}
                <DPELabel index={situation['projet . DPE visé'] - 1 || 1} /> est
                en moyenne{' '}
                <strong>{pourcentageAppreciation.toFixed(1)}%</strong>{' '}
                supérieure à un bien classé{' '}
                <DPELabel index={situation['DPE . actuel'] - 1 || 1} />.
              </small>
            </>,
          )}
          {isNaN(plusValue) && (<>Nous n'avons pas assez de données concernant ce type de bien pour vous proposer une estimation précise.</>)}
      </EvaluationValueWrapper>
    </ModuleWrapper>
  )
}
