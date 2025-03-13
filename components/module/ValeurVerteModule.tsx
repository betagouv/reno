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
import { conversionLettreIndex } from '../DPELabel'

export default function ValeurVerteModule() {
  const engine = new Publicodes(rules)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 600,
  )
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const [commune, setCommune] = useState(null)
  const [pourcentageAppreciation, setPourcentageAppreciation] = useState(0)
  const [plusValue, setPlusValue] = useState(0)
  const situation = getSituation(searchParams, rules)
  const answeredQuestions = Object.keys(situation)

  const value = situation['projet . DPE visé'],
    oldIndex = +situation['DPE . actuel'] - 1,
    automaticChoice = Math.max(oldIndex - 2, 0),
    choice = value ? Math.min(automaticChoice, value - 1) : automaticChoice

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
      setCommune(result)
    }
    fetchCommune()
  }, [situation['logement . commune']])

  useEffect(() => {
    if (!situation['logement . code département']) return
    const region =
      listeDepartementRegion['régions']['valeurs'][
        listeDepartementRegion['départements']['valeurs'][
          situation['logement . code département'].replaceAll('"', '')
        ].codeRegion
      region = listeDepartementRegion['régions']['valeurs'][codeRegion]
    }
    const row = dataValeurVerte.find((r) => r.Région === region && r.Type == situation['logement . type'].replaceAll('"',''))
    
    if (!row) return

    const getPourcentage = (key) => {
      const col = Object.keys(row).find((c) =>
        c.includes(conversionLettreIndex[situation[key] - 1]),
      )
      return col in row
        ? row[col]
            .replaceAll('%', '')
            .split(' à ')
            .reduce((p, c) => p + parseFloat(c), 0) / 2
        : 0
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
        situation["logement . prix d'achat"] * (1 + appreciation / 100),
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
              text: 'Le logement est situé sur la commune de',
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
              text: 'Ce logement est',
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
              text: "Le prix d'achat du logement est de",
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
          />
        </Li>
        <Li
          $next={answeredQuestions.includes('DPE . actuel')}
          $touched={answeredQuestions.includes('projet . DPE visé')}
        >
          <TargetDPETabs
            {...{
              oldIndex,
              setSearchParams,
              answeredQuestions,
              choice,
              engine,
              situation,
              isMobile,
            }}
          />
        </Li>
      </QuestionList>
      <p>Appréciation : {pourcentageAppreciation.toFixed(2)}%</p>
      <p>Plus-value estimée : {plusValue}€</p>
    </ModuleWrapper>
  )
}
