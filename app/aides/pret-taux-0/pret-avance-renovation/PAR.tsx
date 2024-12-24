'use client'

import { Card } from '@/components/UI'
import rules from '@/app/règles/rules'
import checkIcon from '@/public/check.svg'
import Publicodes from 'publicodes'
import Value from '@/components/Value'
import parImage from '@/public/par.png'
import Image from 'next/image'
import {
  IdFQuestion,
  Li,
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
import { useMediaQuery } from 'usehooks-ts'

export default function PAR() {
  const isMobile = useMediaQuery('(max-width: 400px)')
  const engine = new Publicodes(rules)
  const dottedName = 'PAR'
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  const situation = getSituation(searchParams, rules)

  const answeredQuestions = getAnsweredQuestions(searchParams, rules)
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
      <h3>Etes-vous éligible au PAR+ ?</h3>
      <QuestionList>
        <Li
          key="typeResidence"
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
          $touched={answeredQuestions.includes('ménage . région . IdF')}
          key="IdF"
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
          key="personnes"
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
          key="revenu"
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
          key="typeTravaux"
          $next={answeredQuestions.includes('ménage . revenu . classe')}
        >
          <TypeTravaux
            {...{
              engine,
              onChange,
              answeredQuestions,
              situation,
              rules,
              setSearchParams,
            }}
          />
        </Li>
      </QuestionList>
      <h3>Comment est calculée l'aide ?</h3>
      <Card $background="#f7f8f8">
        <div
          css={`
            display: flex;
            align-items: center;
          `}
        >
          <section>
            En tant que ménage{' '}
            <Value
              {...{
                engine,
                situation,
                dottedName: 'ménage . revenu . classe',
                state: 'prime-black',
              }}
            />{' '}
            , vous êtes éligible à un prêt d'un montant maximum de 50 000 € sans
            intérêt pendant 10 ans.
          </section>
        </div>
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
    </>
  )
}
