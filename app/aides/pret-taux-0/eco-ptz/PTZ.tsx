'use client'

import { Card, CTA, CTAWrapper } from '@/components/UI'
import rules from '@/app/règles/rules'
import checkIcon from '@/public/check.svg'
import investissementIcon from '@/public/investissement.svg'
import Publicodes, { formatValue } from 'publicodes'
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
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'
import { useMediaQuery } from 'usehooks-ts'
import AmpleurCTA from '@/app/module/AmpleurCTA'
import { Key } from '@/components/explications/ExplicationUI'

export default function PTZ() {
  const isMobile = useMediaQuery('(max-width: 400px)')
  const engine = new Publicodes(rules)
  const dottedName = 'PTZ'
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  const situation = getSituation(searchParams, rules)
  situation["parcours d'aide"] = "'à la carte'"

  const answeredQuestions = getAnsweredQuestions(searchParams, rules)
  const evaluation = engine.setSituation(situation).evaluate('PTZ . montant')

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
          <Image
            src={'/' + rules[dottedName]['icône']}
            alt="logo éco-PTZ"
            width="100"
            height="100"
          />
        </div>
      </div>
      <Card>
        <h3
          css={`
            margin-top: 1rem;
          `}
        >
          Etes-vous éligible à l'éco-PTZ ?
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
            key="typeTravaux"
            $next={answeredQuestions.includes('logement . au moins 2 ans')}
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
            <p
              css={`
                flex: 1;
              `}
            >
              {evaluation.nodeValue ? (
                <>
                  <strong>Vous êtes éligible</strong>
                  <br />à un prêt d'un montant maximum de{' '}
                  <Key $state="in-progress">{formatValue(evaluation)}</Key> sans
                  intérêt pendant{' '}
                  <Key $state="in-progress">
                    {formatValue(engine.evaluate('PTZ . durée'))}
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
            <CTAWrapper $justify="left" $customCss="margin: 0;">
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
