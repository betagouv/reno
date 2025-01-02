'use client'

import { Card } from '@/components/UI'
import rules from '@/app/règles/rules'
import checkIcon from '@/public/check.svg'
import Publicodes from 'publicodes'
import parImage from '@/public/par.png'
import Image from 'next/image'
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
import useSetSearchParams from '@/components/useSetSearchParams'
import {
  encodeDottedName,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'
import FatConseiller from '@/components/FatConseiller'
import { EligibilityResult } from '@/components/EligibilityResult'
import { useMediaQuery } from 'usehooks-ts'

export default function PAR() {
  const isMobile = useMediaQuery('(max-width: 400px)')
  const engine = new Publicodes(rules)
  const dottedName = 'PAR'
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  const situation = getSituation(searchParams, rules)
  situation["parcours d'aide"] = "'à la carte'"

  const answeredQuestions = getAnsweredQuestions(searchParams, rules)
  const evaluation = engine
    .setSituation(situation)
    .evaluate(dottedName + ' . montant')
  const onChange =
    (dottedName) =>
    ({ target: { value } }) =>
      setSearchParams({
        [encodeDottedName(dottedName)]: value + '*',
      })
  return (
    <>
      <div
        css={`
          display: flex;
          gap: 1rem;
        `}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: rules[dottedName].descriptionHtml,
          }}
        />
        <div>
          <Image src={parImage} alt="logo PAR+" width="120" />
        </div>
      </div>
      <Card>
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
            evaluation,
            engine,
            dottedName,
            situation,
            text: 'au PAR+',
          }}
        />
      </Card>
      <h3>Comment cela fonctionne?</h3>
      <div
        dangerouslySetInnerHTML={{
          __html: rules[dottedName].explicationHTML,
        }}
      />
      <h3>Les principales conditions d'éligibilité ?</h3>
      <div
        css={`
          list-style-image: url(${checkIcon.src});
          li {
            margin: 1rem 0;
            ul {
              list-style-image: none;
            }
          }
        `}
        dangerouslySetInnerHTML={{
          __html: rules[dottedName].conditionsEligibilitesHTML,
        }}
      />
      <FatConseiller
        {...{
          situation,
          margin: 'small',
          titre: 'Comment toucher cette aide ?',
          texte: rules[dottedName].commentFaireHtml,
        }}
      />
    </>
  )
}
