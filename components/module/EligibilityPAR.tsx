'use client'

import {
  IdFQuestion,
  Li,
  PeriodeConstructionQuestion,
  PersonnesQuestion,
  QuestionList,
  RevenuMaxQuestion,
  TypeResidence,
  TypeTravaux,
} from '@/app/module/AmpleurQuestions'
import rules from '@/app/règles/rules'
import rulesInteretEmprunt from '@/app/règles/intérêt-emprunt.publicodes'
import Publicodes from 'publicodes'
import { EligibilityResult } from '@/components/EligibilityResult'
import useSetSearchParams from '@/components/useSetSearchParams'
import {
  encodeDottedName,
  getAnsweredQuestions,
  getSituation,
} from '../publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'
import { useMediaQuery } from 'usehooks-ts'

export default function EligibilityPAR({ dottedName }) {
  const isMobile = useMediaQuery('(max-width: 400px)')
  const rulesWithInterets = {
    ...rules,
    ...rulesInteretEmprunt,
  }
  const engine = new Publicodes(rulesWithInterets)
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())
  const situation = getSituation(searchParams, rulesWithInterets)
  situation["parcours d'aide"] = '"à la carte"'

  const answeredQuestions = getAnsweredQuestions(
    searchParams,
    rulesWithInterets,
  )
  const onChange =
    (dottedName) =>
    ({ target: { value } }) =>
      setSearchParams({
        [encodeDottedName(dottedName)]: value + '*',
      })
  return (
    <>
      <h3
        css={`
          margin-top: 1rem;
        `}
      >
        Etes-vous éligible au PAR+ ?
      </h3>
      <QuestionList>
        <Li
          $next={true}
          $touched={answeredQuestions.includes(
            'logement . résidence principale propriétaire',
          )}
        >
          <TypeResidence
            {...{ setSearchParams, situation, answeredQuestions }}
          />
        </Li>
        <Li
          $next={answeredQuestions.includes(
            'logement . résidence principale propriétaire',
          )}
          $touched={answeredQuestions.includes('logement . au moins 2 ans')}
        >
          <PeriodeConstructionQuestion
            {...{
              setSearchParams,
              situation,
              answeredQuestions,
              periode: 'au moins 2 ans',
            }}
          />
        </Li>
        <Li
          $next={answeredQuestions.includes('logement . au moins 2 ans')}
          $touched={answeredQuestions.includes('ménage . région . IdF')}
        >
          <IdFQuestion
            {...{
              setSearchParams,
              isMobile,
              situation,
              answeredQuestions,
            }}
          />
        </Li>
        <Li
          $next={answeredQuestions.includes('ménage . région . IdF')}
          $touched={answeredQuestions.includes('ménage . personnes')}
        >
          <PersonnesQuestion
            {...{
              onChange,
              answeredQuestions,
              situation,
            }}
          />
        </Li>
        <Li
          $next={answeredQuestions.includes('ménage . personnes')}
          $touched={answeredQuestions.includes('ménage . revenu . classe')}
        >
          <RevenuMaxQuestion
            {...{
              engine,
              onChange,
              answeredQuestions,
              situation,
              setSearchParams,
            }}
          />
        </Li>
        <Li
          $next={answeredQuestions.includes('ménage . revenu . classe')}
          $touched={answeredQuestions.includes('logement . type travaux')}
        >
          <TypeTravaux
            {...{
              setSearchParams,
              situation,
              rules,
            }}
          />
        </Li>
      </QuestionList>
      <EligibilityResult
        {...{
          engine,
          dottedName,
          situation,
          text: 'au PAR+',
        }}
      />
    </>
  )
}
