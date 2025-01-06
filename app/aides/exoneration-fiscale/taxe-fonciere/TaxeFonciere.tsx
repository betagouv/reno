'use client'

import { Card } from '@/components/UI'
import rules from '@/app/règles/rules'
import checkIcon from '@/public/check.svg'
import Publicodes from 'publicodes'
import {
  CommuneLogement,
  Li,
  PeriodeConstructionQuestion,
  QuestionList,
  YesNoQuestion,
} from '@/app/module/AmpleurQuestions'
import useSetSearchParams from '@/components/useSetSearchParams'
import {
  encodeDottedName,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'
import FatConseiller from '@/components/FatConseiller'
import { parse } from 'marked'
import { EligibilityResult } from '@/components/EligibilityResult'

export default function TaxeFonciere() {
  const engine = new Publicodes(rules)
  const dottedName = 'taxe foncière'
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  const situation = getSituation(searchParams, rules)
  const answeredQuestions = getAnsweredQuestions(searchParams, rules)
  const evaluation = engine
    .setSituation(situation)
    .evaluate(dottedName + ' . conditions')

  return (
    <>
      <h2>L'exonération de taxe foncière</h2>
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
                  setSearchParams({
                    [encodeDottedName('logement . commune')]:
                      `"${result.code}"*`,
                    [encodeDottedName('logement . commune . nom')]:
                      `"${result.nom}"*`,
                    [encodeDottedName('taxe foncière . commune . éligible')]:
                      result.eligibilite['taxe foncière . commune . éligible'] +
                      '*',
                    ...(result.eligibilite['taxe foncière . commune . taux']
                      ? {
                          [encodeDottedName('taxe foncière . commune . taux')]:
                            result.eligibilite[
                              'taxe foncière . commune . taux'
                            ] + '*',
                        }
                      : {}),
                  })
                },
              }}
            />
          </Li>
          {situation['taxe foncière . commune . éligible'] == 'oui' && (
            <>
              <Li
                $next={answeredQuestions.includes(
                  'taxe foncière . commune . éligible',
                )}
                $touched={answeredQuestions.includes(
                  'logement . au moins 10 ans',
                )}
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
                $next={answeredQuestions.includes('logement . au moins 10 ans')}
                $touched={answeredQuestions.includes(
                  'taxe foncière . condition de dépenses',
                )}
              >
                <YesNoQuestion
                  {...{
                    setSearchParams,
                    situation,
                    answeredQuestions,
                    rules,
                    rule: 'taxe foncière . condition de dépenses',
                  }}
                />
              </Li>
            </>
          )}
        </QuestionList>
        <EligibilityResult
          {...{
            evaluation,
            engine,
            dottedName,
            situation,
            text: "à l'exonération de taxe foncière",
          }}
        />
      </Card>
      <h3>Comment cela fonctionne?</h3>
      <div
        dangerouslySetInnerHTML={{
          __html: parse(rules[dottedName + ' . taux'].description),
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
