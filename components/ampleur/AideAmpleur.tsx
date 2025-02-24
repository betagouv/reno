import rules from '@/app/règles/rules'
import { ConditionEligibiliteUI, CTA, ExternalLink, PrimeStyle } from '../UI'
import { uncapitalise0 } from '../utils'
import AideCTAs from './AideCTAs'
import { formatValue } from 'publicodes'
import { createExampleSituation } from './AmpleurSummary'
import { useEffect, useRef, useState } from 'react'
import MarSearch from '@/app/trouver-accompagnateur-renov/MarSearch'
import { push } from '@socialgouv/matomo-next'

export default function AideAmpleur({
  isEligible,
  engine,
  dottedName,
  setSearchParams,
  situation,
  answeredQuestions,
  children,
  expanded,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenConseiller, setIsOpenConseiller] = useState(false)
  const contentRef = useRef(null)
  useEffect(() => {
    if (!expanded && contentRef.current) {
      contentRef.current.style.maxHeight = isOpen
        ? `${contentRef.current.scrollHeight}px`
        : '0px'
    }
  }, [isOpen])
  return (
    <>
      <header
        css={`
          margin: 0 0 1rem 0;
          font-size: 130%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          &:hover {
            ${!expanded && 'cursor: pointer;'}
          }
        `}
        onClick={() => !expanded && setIsOpen(!isOpen)}
      >
        <div>
          {expanded ? (
            <h1
              css={`
                margin: 0 0 0.5rem 0;
              `}
            >
              {aideTitle(dottedName)}
            </h1>
          ) : (
            <h3
              css={`
                margin: 0 0 0.5rem 0;
                color: var(--color);
              `}
            >
              {aideTitle(dottedName)}
            </h3>
          )}
          <PrimeWithLabel
            {...{
              engine,
              situation,
              dottedName: dottedName + ' . montant',
            }}
          />
        </div>
        {!expanded && (
          <div
            css={`
              &::after {
                content: '';
                display: inline-block;
                width: 10px;
                height: 10px;
                border-bottom: 2px solid var(--color);
                border-right: 2px solid var(--color);
                transform: rotate(${isOpen ? '225deg' : '45deg'});
                transition: transform 0.3s ease-in-out;
              }
            `}
          />
        )}
      </header>
      <div
        ref={contentRef}
        css={`
          ${!expanded && 'max-height: 0;'}
          opacity: ${isOpen || expanded ? '1' : '0'};
          ${isOpen && 'margin-bottom: 1rem;'};
          overflow: hidden;
          transition:
            max-height 0.4s ease-out,
            opacity 0.3s ease-out;
        `}
      >
        {expanded && (
          <h2
            css={`
              font-size: 130%;
              margin: 0 0 1rem 0 !important;
            `}
          >
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
        )}
        <div
          dangerouslySetInnerHTML={{
            __html: rules[dottedName].descriptionHtml,
          }}
        />
        {!expanded && isEligible && (
          <AideCTAs
            {...{
              dottedName,
              setSearchParams,
              situation,
              answeredQuestions,
              expanded,
            }}
          />
        )}
      </div>
      {expanded && (
        <>
          {children}
          <ConditionEligibiliteUI>
            {rules[dottedName].conditionsEligibilitesHTML}
          </ConditionEligibiliteUI>
          <p
            css={`
              margin-top: 1.6rem;
            `}
          >
            <ExternalLink href={rules[dottedName]['lien']} target="_blank">
              Plus d'infos sur cette aide
            </ExternalLink>
          </p>
          <CTA
            css={`
              padding: 1rem;
              text-wrap: wrap;
              text-align: center;
              margin: auto;
              margin-bottom: 1rem;
              cursor: pointer;
            `}
            $fontSize="normal"
            onClick={() => {
              setIsOpenConseiller(!isOpenConseiller)
              push([
                'trackEvent',
                'Simulateur Principal',
                'Clic',
                'trouver conseiller',
              ])
            }}
          >
            Trouver mon conseiller local
          </CTA>
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
          <AideCTAs
            {...{
              dottedName,
              setSearchParams,
              situation,
              answeredQuestions,
              expanded,
            }}
          />
        </>
      )}
    </>
  )
}

export const PrimeWithLabel = ({ engine, dottedName, situation }) => {
  const bestSituation = createExampleSituation(situation, 'best')
  const montantMax = engine.setSituation(bestSituation).evaluate(dottedName)

  return montantMax.nodeValue ? (
    <PrimeStyle
      css={`
        font-size: 1rem;
      `}
    >
      <AideMontant
        {...{
          engine,
          situation: bestSituation,
          dottedName,
        }}
      />
      <AideDurée
        {...{
          engine,
          situation: bestSituation,
          dottedName,
        }}
      />
    </PrimeStyle>
  ) : (
    dottedName != 'aides locales . montant' && (
      <PrimeStyle
        css={`
          font-size: 1rem;
        `}
        $inactive
      >
        Non éligible
      </PrimeStyle>
    )
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
        <CTA $importance="secondary">
          <span>
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
          </span>
        </CTA>
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
export function AideMontant({ engine, situation, dottedName }) {
  const montantMax = engine.setSituation(situation).evaluate(dottedName)
  const worstSituation = createExampleSituation(situation, 'worst')
  const montantMin = engine.setSituation(worstSituation).evaluate(dottedName)
  return dottedName.includes('taxe foncière') ? (
    <strong>{situation['taxe foncière . commune . taux']}</strong>
  ) : dottedName.includes('denormandie') ? (
    <>
      Jusqu'à{' '}
      <strong>
        {formatValue(
          engine.setSituation(situation).evaluate('denormandie . taux'),
        )}
      </strong>
    </>
  ) : montantMax.nodeValue == montantMin.nodeValue ? (
    <>
      {rules[dottedName.replace(' . montant', '')].type == 'prêt'
        ? "Jusqu'à"
        : 'Prime de'}{' '}
      <strong>{formatValue(montantMin)}</strong>
    </>
  ) : (
    <>
      De <strong>{formatValue(montantMin)}</strong> à{` `}
      <strong>{formatValue(montantMax)}</strong> d'aides
    </>
  )
}
export function AideDurée({ engine, situation, dottedName }) {
  const duréeName =
    dottedName.replace(/\s.\smontant$/, ' . ') +
    (dottedName.includes('denormandie') ? 'années de location' : 'durée')
  const duréeRule = rules[duréeName]

  if (!duréeRule) return null
  const evaluation = engine.setSituation(situation).evaluate(duréeName)
  return (
    <span>
      {rules[dottedName.replace(' . montant', '')].type == 'prêt' && (
        <> de prêt</>
      )}{' '}
      sur {evaluation.nodeValue} ans
    </span>
  )
}
