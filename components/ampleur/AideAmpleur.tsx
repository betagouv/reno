import rules from '@/app/règles/rules'
import { ConditionEligibiliteUI } from '../UI'
import { uncapitalise0 } from '../utils'
import AideCTAs from './AideCTAs'
import { useState } from 'react'
import MarSearch from '@/app/trouver-conseiller-france-renov/MarSearch'
import { push } from '@socialgouv/matomo-next'
import Accordion from '@codegouvfr/react-dsfr/Accordion'
import { PrimeBadge } from '../Geste'
import Button from '@codegouvfr/react-dsfr/Button'

export default function AideAmpleur({
  isEligible,
  engine,
  dottedName,
  setSearchParams,
  situation,
  answeredQuestions,
  children,
  expanded,
  addedText = null,
}) {
  const [isOpenConseiller, setIsOpenConseiller] = useState(false)
  return (
    <>
      {expanded ? (
        <>
          <div
            css={`
              display: flex;
              flex-direction: column;
            `}
            className="fr-my-5v"
          >
            <h1>
              {aideTitle(dottedName)}
              <br />
              <PrimeBadge
                {...{
                  situation,
                  engine,
                  dottedName,
                }}
              />
            </h1>
          </div>
          <h2 className="fr-mt-5">
            <span
              aria-hidden="true"
              css={`
                display: inline-block;
                margin-right: 0.5rem;
              `}
            >
              🤓
            </span>
            De quoi s’agit-il ?
          </h2>
          <div
            dangerouslySetInnerHTML={{
              __html: rules[dottedName].descriptionHtml,
            }}
          />
          {
            <>
              {children}
              <ConditionEligibiliteUI>
                {rules[dottedName].conditionsEligibilitesHTML}
              </ConditionEligibiliteUI>
              <p>
                <a
                  rel="noopener external"
                  className="fr-link"
                  href={rules[dottedName]['lien']}
                  target="_blank"
                >
                  Plus d'infos sur cette aide
                </a>
              </p>

              {isOpenConseiller && (
                <div
                  css={`
                    display: flex;
                    justify-content: space-around;
                    gap: 1rem;
                    align-items: center;
                    background: var(--lightestColor);
                    padding: 1rem;
                    margin-bottom: 1rem;
                    border: 1px solid #d0d0ed;
                    h3 {
                      margin: 0 0 1rem 0;
                    }
                  `}
                >
                  <MarSearch
                    situation={situation}
                    what={'trouver-conseiller-renov'}
                  />
                </div>
              )}
            </>
          }
        </>
      ) : (
        <Accordion
          label={
            <div
              css={`
                display: flex;
                flex-direction: column;
              `}
            >
              {aideTitle(dottedName)}
              {isEligible && (
                <PrimeBadge
                  {...{
                    situation,
                    engine,
                    dottedName,
                  }}
                />
              )}
            </div>
          }
          onExpandedChange={() => {
            push([
              'trackEvent',
              'Simulateur Principal',
              'Page',
              'Déplie geste ' + dottedName,
            ])
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: rules[dottedName].descriptionHtml,
            }}
          />
          {addedText}
          {isEligible && (
            <AideCTAs
              {...{
                dottedName,
                setSearchParams,
              }}
            />
          )}
        </Accordion>
      )}
    </>
  )
}

export function AideCTA({ children, text }) {
  return (
    <details
      css={`
        margin: 1.8rem 0 1rem;
        summary {
          list-style-type: none;
        }
        > section {
          margin: 1rem 0;
          padding-left: 1rem;
          border-left: 2px solid var(--color);
        }
      `}
    >
      <summary>
        <Button priority="secondary">
          <span
            css={`
              display: flex;
              align-items: center;
              padding: 0.6rem 0;
              img {
                filter: invert(1);
                width: 1.8rem;
                margin-right: 0.6rem;
                height: auto;
                vertical-align: bottom;
              }
              color: inherit;
            `}
          >
            {text}
          </span>
        </Button>
      </summary>
      <section>{children}</section>
    </details>
  )
}
export const aideTitle = (dottedName) => {
  const rule = rules[dottedName]
  const marque2 = rule['complément de marque']
  return rule.marque + (marque2 ? ' - ' + uncapitalise0(marque2) : '')
}

export function AideDurée({ engine, situation, dottedName }) {
  const duréeName =
    dottedName.replace(/\s.\smontant$/, '') +
    (dottedName.includes('denormandie') ? ' . années de location' : ' . durée')
  const duréeRule = rules[duréeName]
  if (!duréeRule) return null
  const evaluation = engine.setSituation(situation).evaluate(duréeName)
  return (
    <>
      {rules[dottedName.replace(' . montant', '')].type == 'prêt' && (
        <> de prêt</>
      )}{' '}
      sur {evaluation.nodeValue} ans
    </>
  )
}
