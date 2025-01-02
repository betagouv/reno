'use client'

import { Card } from '@/components/UI'
import rules from '@/app/règles/rules'
import Publicodes from 'publicodes'
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
  YesNoQuestion,
} from '@/app/module/AmpleurQuestions'
import useSetSearchParams from '@/components/useSetSearchParams'
import {
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'
import FatConseiller from '@/components/FatConseiller'
import { parse } from 'marked'
import { EligibilityResult } from '@/components/EligibilityResult'

export default function PTZ() {
  const engine = new Publicodes(rules)
  const dottedName = 'PTZ'
  const setSearchParams = useSetSearchParams()
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  const situation = getSituation(searchParams, rules)

  const answeredQuestions = getAnsweredQuestions(searchParams, rules)
  const evaluation = engine
    .setSituation(situation)
    .evaluate(dottedName + ' . montant')
  return (
    <>
      <div
        css={`
          display: flex;
          gap: 1rem;
        `}
      >
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html: rules[dottedName].descriptionHtml,
            }}
          />
          <div
            dangerouslySetInnerHTML={{
              __html: rules[dottedName]['informationsUtilesHtml'],
            }}
          />
        </div>
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
            $touched={answeredQuestions.includes(
              dottedName + ' . condition maprimerenov',
            )}
          >
            <YesNoQuestion
              {...{
                setSearchParams,
                situation,
                answeredQuestions,
                rules,
                rule: dottedName + ' . condition maprimerenov',
                text: "Sollicitez-vous également l'aide MaPrimeRénov' (parcours accompagné ou par geste)",
              }}
            />
          </Li>
          {answeredQuestions.includes(
            dottedName + ' . condition maprimerenov',
          ) &&
            situation[dottedName + ' . condition maprimerenov'] == 'non' && (
              <Li
                $next={answeredQuestions.includes(
                  dottedName + ' . condition maprimerenov',
                )}
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
            )}
        </QuestionList>
        <EligibilityResult
          {...{
            evaluation,
            engine,
            dottedName,
            situation,
            text: "à l'éco-PTZ",
          }}
        />
      </Card>
      <h3>Comment cela fonctionne?</h3>
      <div
        css={`
          table {
            border-collapse: collapse;
            margin-bottom: 1rem;
            td,
            th {
              border: 1px solid black;
              text-align: center;
              padding: 0.5rem;
            }
            td {
              white-space: nowrap;
            }
          }
        `}
        dangerouslySetInnerHTML={{
          __html: parse(rules[dottedName]['description détaillé']),
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
