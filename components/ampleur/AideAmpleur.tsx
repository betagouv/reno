import rules from '@/app/règles/rules'
import informationIcon from '@/public/information.svg'
import Image from 'next/image'
import { CTA, ExternalLink, PrimeStyle } from '../UI'
import { encodeDottedName } from '../publicodes/situationUtils'
import { uncapitalise0 } from '../utils'
import AideCTAs from './AideCTAs'
import styled from 'styled-components'
import { formatValue } from 'publicodes'
import FatConseiller from '../FatConseiller'
import AideDurée from './AideDurée'
import { createExampleSituation } from './AmpleurSummary'
import { useEffect, useRef, useState } from 'react'

export default function AideAmpleur({
  engine,
  dottedName,
  setSearchParams,
  situation,
  answeredQuestions,
  children,
  expanded,
  level = null,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const contentRef = useRef(null)
  const rule = rules[dottedName]
  const marque2 = rule['complément de marque'],
    title = rule.marque + (marque2 ? ' - ' + uncapitalise0(marque2) : '')
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = isOpen
        ? `${contentRef.current.scrollHeight}px`
        : '0px'
    }
  }, [isOpen])
  return (
    <section
      id={'aide-' + encodeDottedName(dottedName)}
      css={`
        border-bottom: 1px solid var(--lighterColor2);
        margin-bottom: 1rem;
      `}
    >
      <header
        css={`
          margin: 0 0 1rem 0;
          ${level === 2 && 'font-size: 110%;'}
          font-size: 130%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          &:hover {
            cursor: pointer;
          }
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h3
            css={`
              margin: 0 0 0.5rem 0;
              color: var(--darkColor0);
            `}
          >
            {title}
          </h3>
          <PrimeWithLabel
            {...{
              engine,
              situation,
              dottedName: dottedName + ' . montant',
            }}
          />
        </div>
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
      </header>
      <div
        ref={contentRef}
        css={`
          max-height: 0;
          opacity: ${isOpen ? '1' : '0'};
          overflow: hidden;
          transition:
            max-height 0.4s ease-out,
            opacity 0.3s ease-out;
        `}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: rules[dottedName].descriptionHtml,
          }}
        />
        <AideCTAs
          {...{
            dottedName,
            setSearchParams,
            situation,
            answeredQuestions,
            expanded,
          }}
        />
      </div>
      {expanded && (
        <>
          {children}
          {dottedName != 'ampleur . prime individuelle copropriété' && (
            <p
              css={`
                margin-top: 1.6rem;
              `}
            >
              <ExternalLink href={rules[dottedName]['lien']} target="_blank">
                Plus d'infos sur cette aide
              </ExternalLink>
            </p>
          )}
          <FatConseiller
            {...{
              situation,
              margin: 'small',
              titre: 'Comment toucher cette aide ?',
              texte: rule.commentFaireHtml,
            }}
          />
        </>
      )}
    </section>
  )
}

export const PrimeWithLabel = ({ engine, dottedName, situation }) => {
  const bestSituation = createExampleSituation(engine, situation, 'best')
  const worstSituation = createExampleSituation(engine, situation, 'worst')
  const montantMax = engine.setSituation(bestSituation).evaluate(dottedName)
  const montantMin = engine.setSituation(worstSituation).evaluate(dottedName)

  return montantMax.nodeValue ? (
    <PrimeStyle
      css={`
        font-size: 1rem;
      `}
    >
      {dottedName.includes('taxe foncière') ? (
        <strong>{situation['taxe foncière . commune . taux']}</strong>
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
          <strong>{formatValue(montantMax)}</strong>
        </>
      )}
      <AideDurée engine={engine} dottedName={dottedName} />
    </PrimeStyle>
  ) : dottedName != 'aides locales' ? (
    <PrimeStyle
      css={`
        font-size: 1rem;
      `}
      $inactive
    >
      Non éligible
    </PrimeStyle>
  ) : (
    ''
  )
}

export const PictoTypeAide = styled.div`
  width: fit-content;
  color: ${(p) => p.$style.color};
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  .icon {
    padding: 1rem;
    background: url('${(p) => p.$style.icon.src}')
      ${(p) => p.$style.backgroundColor} no-repeat center;
    border: 1px solid ${(p) => p.$style.borderColor};
    border-radius: 5px;
  }
  .type {
    display: inline-block;
    margin-top: 0.3rem;
  }
  span {
    font-size: 60%;
  }
`

export const InformationBlock = ({ children }) => (
  <section
    css={`
      margin-top: 2vh !important;

      header {
        display: flex;
        align-items: center;
        h4 {
          color: #0359bf;
          margin: 0;

          font-weight: 500;
        }
        margin-bottom: 1.5vh !important;
      }
      ol li {
        margin: 0.6rem 0;
        list-style-type: disc;
      }
    `}
  >
    <header>
      <Image
        src={informationIcon}
        width="25"
        css={`
          margin-right: 0.4rem;
        `}
        alt="icone d'information"
      />
      <h4>Informations utiles</h4>
    </header>
    <ol>{children}</ol>
  </section>
)
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
