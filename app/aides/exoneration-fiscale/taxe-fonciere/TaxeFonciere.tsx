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
  YesNoQuestion,
} from '@/app/module/AmpleurQuestions'
import useSetSearchParams from '@/components/useSetSearchParams'
import {
  encodeDottedName,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'
import AmpleurCTA from '@/app/module/AmpleurCTA'
import { Key } from '@/components/explications/ExplicationUI'
import { useMediaQuery } from 'usehooks-ts'
import FatConseiller from '@/components/FatConseiller'
import { parse } from 'marked'

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
    .evaluate(dottedName + ' . conditions')

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
        {(!Object.keys(evaluation.missingVariables).length ||
          situation['taxe foncière . commune . éligible'] == 'non') && (
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
                  <strong>Vous êtes éligible à une exonération de </strong>
                  <Key
                    $state="prime"
                    css={`
                      display: block;
                      margin: 0.5rem auto;
                      width: fit-content;
                      font-size: 1.5rem;
                      padding: 0.5rem;
                    `}
                  >
                    {formatValue(engine.evaluate(dottedName + ' . taux'))}
                  </Key>{' '}
                  de Taxe Foncière pendant{' '}
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
                    {situation['taxe foncière . commune . éligible'] == 'non'
                      ? "Cette commune n'est"
                      : "Vous n'êtes"}{' '}
                    pas éligible à l'exonération de taxe foncière
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
