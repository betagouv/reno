'use client'

import { Card, CTA, CTAWrapper } from '@/components/UI'
import rules from '@/app/règles/rules'
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
  YesNoQuestion,
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
import FatConseiller from '@/components/FatConseiller'
import { parse } from 'marked'

export default function PTZ() {
  const isMobile = useMediaQuery('(max-width: 400px)')
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
              text-align: center;
              flex-wrap: wrap;
            `}
          >
            {!isMobile && (
              <Image src={investissementIcon} alt="icone montant en euro" />
            )}
            <p
              css={`
                flex: 1;
                margin: 0;
              `}
            >
              {evaluation.nodeValue ? (
                <>
                  <strong>Vous êtes éligible à un prêt d'un montant</strong>
                  <span
                    css={`
                      display: block;
                      margin: 0.5rem 0;
                    `}
                  >
                    de{' '}
                    <Key
                      $state="prime"
                      css={`
                        font-size: 1.5rem;
                        padding: 0.4rem;
                      `}
                    >
                      {formatValue(engine.evaluate(dottedName + ' . montant'))}
                    </Key>{' '}
                    maximum
                  </span>
                  <small>
                    sans intérêt pendant{' '}
                    <Key $state="in-progress">
                      {formatValue(engine.evaluate(dottedName + ' . durée'))}
                    </Key>
                  </small>
                </>
              ) : (
                <>
                  <span
                    css={`
                      color: red;
                    `}
                  >
                    Vous n'êtes pas éligible à l'éco-PTZ
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
