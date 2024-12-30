'use client'

import { Card, CTA, CTAWrapper } from '@/components/UI'
import rules from '@/app/règles/rules'
import checkIcon from '@/public/check.svg'
import investissementIcon from '@/public/investissement.svg'
import Publicodes, { formatValue } from 'publicodes'
import Image from 'next/image'
import {
  CommuneLogement,
  Li,
  PeriodeConstructionQuestion,
  QuestionList,
  TFDepenseQuestion,
} from '@/app/module/AmpleurQuestions'
import useSetSearchParams from '@/components/useSetSearchParams'
import {
  encodeSituation,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'
import AmpleurCTA from '@/app/module/AmpleurCTA'
import { Key } from '@/components/explications/ExplicationUI'
import { useMediaQuery } from 'usehooks-ts'

export default function TaxeFonciere() {
  const isMobile = useMediaQuery('(max-width: 400px)')
  const engine = new Publicodes(rules)
  const dottedName = 'taxe foncière'
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  const situation = getSituation(searchParams, rules)
  const answeredQuestions = getAnsweredQuestions(searchParams, rules)
  const evaluation = engine
    .setSituation(situation)
    .evaluate(dottedName + ' . taux')

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
      </div>
      <Card>
        <h3
          css={`
            margin-top: 1rem;
          `}
        >
          Etes-vous éligible à l'exonération de Taxe Foncière ?
        </h3>
        <QuestionList>
          <Li
            key="communeLogement"
            $next={true}
            $touched={answeredQuestions.includes(
              'taxe foncière . commune . éligible',
            )}
          >
            <CommuneLogement
              {...{
                setSearchParams,
                situation,
                answeredQuestions,
                onChange: (result) => {
                  const encodedSituation = encodeSituation(
                    {
                      ...situation,
                      'taxe foncière . commune . éligible':
                        result.eligibilite[
                          'taxe foncière . commune . éligible'
                        ] + '*',
                      'taxe foncière . commune . taux':
                        result.eligibilite['taxe foncière . commune . taux'],
                    },
                    false,
                  )

                  setSearchParams(encodedSituation, 'replace', false)
                },
              }}
            />
          </Li>
          <Li
            key="periodeConstruction"
            $next={answeredQuestions.includes(
              'taxe foncière . commune . éligible',
            )}
            $touched={answeredQuestions.includes('logement . au moins 10 ans')}
          >
            <PeriodeConstructionQuestion
              {...{
                setSearchParams,
                situation,
                answeredQuestions,
                periode: 'au moins 10 ans',
              }}
            />
          </Li>
          <Li
            key="conditionDepense"
            $next={answeredQuestions.includes('logement . au moins 10 ans')}
            $touched={answeredQuestions.includes(
              'taxe foncière . condition de dépenses',
            )}
          >
            <TFDepenseQuestion
              {...{
                setSearchParams,
                situation,
                answeredQuestions,
                rules,
              }}
            />
          </Li>
        </QuestionList>
        {answeredQuestions.length == 3 && (
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
                  <br />à une exonération de{' '}
                  <Key $state="in-progress">
                    {formatValue(engine.evaluate(dottedName + ' . taux'))}
                  </Key>{' '}
                  du montant de votre Taxe Foncière pendant{' '}
                  <Key $state="in-progress">
                    {formatValue(engine.evaluate(dottedName + ' . durée'))}
                  </Key>
                </>
              ) : (
                <>
                  <span
                    css={`
                      color: red;
                    `}
                  >
                    Vous n'êtes pas éligible à l'exonération de taxe foncière
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
