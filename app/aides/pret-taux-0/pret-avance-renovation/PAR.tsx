'use client'

import { Card, CTA, CTAWrapper, PrimeStyle } from '@/components/UI'
import rules from '@/app/règles/rules'
import checkIcon from '@/public/check.svg'
import investissementIcon from '@/public/investissement.svg'
import Publicodes, { formatValue } from 'publicodes'
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
import { useMediaQuery } from 'usehooks-ts'
import AmpleurCTA from '@/app/module/AmpleurCTA'
import { Key } from '@/components/explications/ExplicationUI'

export default function PAR() {
  const isMobile = useMediaQuery('(max-width: 400px)')
  const engine = new Publicodes(rules)
  const dottedName = 'PAR'
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  const situation = getSituation(searchParams, rules)

  const answeredQuestions = getAnsweredQuestions(searchParams, rules)
  const evaluation = engine.setSituation(situation).evaluate('PAR . montant')

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
            key="periodeConstruction"
            $next={answeredQuestions.includes(
              'logement . résidence principale propriétaire',
            )}
            $touched={answeredQuestions.includes('logement . au moins 2 ans')}
          >
            <PeriodeConstructionQuestion
              {...{ setSearchParams, situation, answeredQuestions }}
            />
          </Li>
          <Li
            $next={answeredQuestions.includes('logement . au moins 2 ans')}
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
                setSearchParams,
                situation,
                rules,
              }}
            />
          </Li>
        </QuestionList>
        {!Object.keys(evaluation.missingVariables).length && (
          <div
            css={`
              background: var(--lightestColor);
              border-bottom: 4px solid var(--color);
              padding: 1rem;
              display: flex;
              gap: 1rem;
              justify-content: space-between;
              align-items: center;
              flex-wrap: wrap;
            `}
          >
            {!isMobile && (
              <Image src={investissementIcon} alt="icone montant en euro" />
            )}
            <p>
              {evaluation.nodeValue ? (
                <>
                  <strong>Vous êtes éligible</strong>
                  <br />à un prêt d'un montant maximum de
                  <br />
                  <Key $state="in-progress">{formatValue(evaluation)}</Key> sans
                  intérêt pendant{' '}
                  <Key $state="in-progress">
                    {formatValue(engine.evaluate('PAR . durée'))}s
                  </Key>
                </>
              ) : (
                <>
                  <span
                    css={`
                      color: red;
                    `}
                  >
                    Vous n'êtes pas éligible au Prêt avance mutation
                  </span>
                  <br />
                  <span>⚠️ Vous êtes peut-être éligible à d'autres aides!</span>
                  <br />
                </>
              )}
            </p>
            <CTAWrapper $justify="left">
              <CTA $importance="primary" css="font-size: 100%">
                <AmpleurCTA {...{ situation: situation }} />
              </CTA>
            </CTAWrapper>
          </div>
        )}
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
