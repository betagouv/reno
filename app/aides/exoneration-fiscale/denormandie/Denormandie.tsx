'use client'
import AmpleurCTA from '@/app/module/AmpleurCTA'
import { Card, CTA, CTAWrapper } from '@/components/UI'
import rules from '@/app/règles/rules'
import checkIcon from '@/public/check.svg'
import investissementIcon from '@/public/investissement.svg'
import Publicodes, { formatValue } from 'publicodes'
import useSetSearchParams from '@/components/useSetSearchParams'
import { useSearchParams } from 'next/navigation'
import { useMediaQuery } from 'usehooks-ts'
import Image from 'next/image'
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
import { Key } from '@/components/explications/ExplicationUI'
import Value from '@/components/Value'

export default function Denormandie() {
  const isMobile = useMediaQuery('(max-width: 400px)')
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
            key="communeLogement"
            $next={answeredQuestions.includes(
              'logement . résidence principale propriétaire',
            )}
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
          <Li
            key="prixAchat"
            $next={answeredQuestions.includes(
              'logement . commune . denormandie',
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
            key="montantTravaux"
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
            key="dureeLocation"
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
            key="ameliorationEnergetique"
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
                text: "Allez-vous améliorer la performance énergétique d'au moins 30% ou réaliser 2 types de travaux parmi: changement de chaudière ; isolation thermique des combles ; isolation thermique des murs ; changement de production d'eau chaude ; isolation thermique des fenêtres. ",
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
                  <strong>Vous êtes éligible à une réduction d'impôt de</strong>
                  <span
                    css={`
                      display: block;
                      text-align: center;
                      margin: 1rem 0;
                    `}
                  >
                    <Key
                      $state="prime"
                      css={`
                        font-size: 1.5rem;
                        padding: 0.4rem;
                      `}
                    >
                      {formatValue(engine.evaluate(dottedName + ' . montant'))}
                    </Key>{' '}
                    sur{' '}
                    <Key $state="in-progress">
                      {formatValue(engine.evaluate(dottedName + ' . durée'))}
                    </Key>
                  </span>
                  <small>
                    Détail:{' '}
                    <Key $state="in-progress">
                      {formatValue(engine.evaluate(dottedName + ' . taux'))}
                    </Key>{' '}
                    du coût du bien{' '}
                    {engine.evaluate(dottedName + ' . assiette').nodeValue <
                    engine.evaluate(dottedName + ' . plafond').nodeValue ? (
                      <>
                        soit{' '}
                        <Key $state="in-progress">
                          {formatValue(
                            engine.evaluate(dottedName + ' . assiette'),
                          )}
                        </Key>
                      </>
                    ) : (
                      <>
                        plafonné à{' '}
                        <Key $state="in-progress">
                          {formatValue(
                            engine.evaluate(dottedName + ' . plafond'),
                          )}
                        </Key>
                      </>
                    )}
                  </small>
                </>
              ) : (
                <>
                  <span
                    css={`
                      color: red;
                    `}
                  >
                    Vous n'êtes pas éligible au dispositif Denormandie
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
