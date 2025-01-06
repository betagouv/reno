'use client'
import { Card } from '@/components/UI'
import rules from '@/app/règles/rules'
import checkIcon from '@/public/check.svg'
import Publicodes, { formatValue } from 'publicodes'
import useSetSearchParams from '@/components/useSetSearchParams'
import { useSearchParams } from 'next/navigation'
import {
  encodeDottedName,
  getAnsweredQuestions,
  getSituation,
} from '@/components/publicodes/situationUtils'
import {
  CommuneLogement,
  DureeLocation,
  Li,
  MontantQuestion,
  QuestionList,
  TypeResidence,
  YesNoQuestion,
} from '@/app/module/AmpleurQuestions'
import FatConseiller from '@/components/FatConseiller'
import { EligibilityResult } from '@/components/EligibilityResult'

export default function Denormandie() {
  const engine = new Publicodes(rules)
  const dottedName = 'denormandie'
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
      <h2>Le dispositif Denormandie</h2>
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
          Etes-vous éligible au dispositif Denormandie ?
        </h3>
        <QuestionList>
          <Li
            $next={true}
            $touched={answeredQuestions.includes(
              'denormandie . commune . éligible',
            )}
          >
            <CommuneLogement
              {...{
                setSearchParams,
                situation,
                answeredQuestions,
                onChange: (result) => {
                  setSearchParams({
                    [encodeDottedName('logement . commune . denormandie')]:
                      result.eligibilite['logement . commune . denormandie'] +
                      '*',
                    [encodeDottedName('logement . commune')]:
                      `"${result.code}"*`,
                    [encodeDottedName('logement . commune . nom')]:
                      `"${result.nom}"*`,
                  })
                },
              }}
            />
          </Li>
          {situation['logement . commune . denormandie'] == 'oui' && (
            <>
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
                $touched={answeredQuestions.includes("logement . prix d'achat")}
              >
                <MontantQuestion
                  {...{
                    setSearchParams,
                    situation,
                    answeredQuestions,
                    rule: "logement . prix d'achat",
                    text: "Le prix d'achat du logement est de",
                  }}
                />
              </Li>
              <Li
                $next={answeredQuestions.includes("logement . prix d'achat")}
                $touched={answeredQuestions.includes('projet . travaux')}
              >
                <MontantQuestion
                  {...{
                    setSearchParams,
                    situation,
                    answeredQuestions,
                    rule: 'projet . travaux',
                    text: 'Le budget travaux est estimé à',
                  }}
                />
              </Li>
              <Li
                $next={answeredQuestions.includes('projet . travaux')}
                $touched={answeredQuestions.includes(
                  'denormandie . années de location',
                )}
              >
                <DureeLocation
                  {...{
                    setSearchParams,
                    situation,
                    rules,
                    answeredQuestions,
                    rule: 'denormandie . années de location',
                  }}
                />
              </Li>
              <Li
                $next={answeredQuestions.includes('projet . travaux')}
                $touched={answeredQuestions.includes(
                  'denormandie . amélioration énergétique',
                )}
              >
                <YesNoQuestion
                  {...{
                    setSearchParams,
                    situation,
                    answeredQuestions,
                    rules,
                    rule: 'denormandie . amélioration énergétique',
                    text: "Allez-vous améliorer la performance énergétique d'au moins 30% ou réaliser 2 types de travaux parmi: changement de chaudière, de production d'eau chaude, isolation thermique des combles, des murs ou des fenêtres.",
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
            text: 'au dispositif Denormandie',
          }}
        />
      </Card>
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
