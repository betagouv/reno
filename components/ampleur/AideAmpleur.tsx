import rules from '@/app/règles/rules'
import informationIcon from '@/public/information.svg'
import starIcon from '@/public/star-full-gold.svg'
import remboursementIcon from '@/public/icon-remboursement.svg'
import pretIcon from '@/public/icon-pret.svg'
import exonerationIcon from '@/public/icon-exoneration-fiscale.svg'
import Image from 'next/image'
import { CTA, Card } from '../UI'
import { encodeDottedName } from '../publicodes/situationUtils'
import { uncapitalise0 } from '../utils'
import chainIcon from '@/public/link-chain.svg'
import AideCTAs from './AideCTAs'
import styled from 'styled-components'
import { useSearchParams } from 'next/navigation'

export default function AideAmpleur({ 
  dottedName, 
  setSearchParams,
  situation,
  answeredQuestions, 
  children,
  expanded,
  level = null 
}) {
  
  const rawSearchParams = useSearchParams(),
  searchParams = Object.fromEntries(rawSearchParams.entries())
  
  const rule = rules[dottedName]
  const isFavorite = rule.favorite === 'oui',
    marque2 = rule['complément de marque'],
    title = rule.marque + (marque2 ? ' - ' + uncapitalise0(marque2) : ''),
    aideStyles = {
      prêt: {
        color: "#79A5DB",
        backgroundColor: "#CDE4FF",
        borderColor: "#79A5DB",
        icon: pretIcon
      },
      "exonération fiscale": {
        color: "#CD9C5D",
        backgroundColor: "#FFE9CD",
        borderColor: "#CD9C5D",
        icon: exonerationIcon
      },
      remboursement: {
        color: "#8484D0",
        backgroundColor: "#E3E3FD",
        borderColor: "#8484D0",
        icon: remboursementIcon
      }
    }
  const style = aideStyles[rule["type"]] || {};
  
  const isSelected = searchParams.synthese?.includes(encodeDottedName(dottedName))
  return (
    <section
      id={'aide-' + encodeDottedName(dottedName)}
      css={
        level === 2 && !expanded &&
        `
		  border-left: 2px dashed #dfdff1;
		  padding-top: .6rem;
		  padding-left: 1rem;
		  position: relative;
		  `
      }
    >
      {false && level === 2 && (
        <span>
          <Image
            css={`
              position: absolute;
              top: -0.1rem;
              left: 50%;
              transform: translateX(-60%);
              width: 3rem;
              height: auto;
            `}
            src={chainIcon}
            alt="Icône représentant le lien chainé entre l'aide MaPrimeRénov' parcours accompagnée, et l'aide à l'audit energétique"
          />
        </span>
      )}

      { expanded ? (
        <>
          <header
            css={`
              margin: 0;
            `}
          >
            <small>En détail</small>
            <h2 css={`
              font-size: 120%;
              margin: 0.5rem 0 !important;
            `}>
              {title}
            </h2>
          </header>
          <Card css={`width: fit-content`}>
            {rule["type"] && (
              <PictoTypeAide
                $style={style}
                $expanded={expanded}
              >
                <span className="icon"></span>
                <span>{rule["type"]}</span>
              </PictoTypeAide>
            )}
          </Card>
          {children}
          <AideCTAs {...{
              dottedName, 
              setSearchParams,
              situation,
              answeredQuestions,
              expanded
            }} 
          />
        </>
      ) : (        
        <Card css={`background: ${isSelected ? "rgba(205, 228, 255, 0.20);" : ""}`}>
          <header
            css={`
              margin: 0 0 1rem 0;
              ${level === 2 && 'font-size: 110%;'}
              font-size: 130%;
              display: flex;
              align-items: center;
              justify-content: space-between;
            `}
          >
            {false && isFavorite && (
              <Image
                src={starIcon}
                alt="Icône étoile signalant le parcours recommandé"
              />
            )}
            <div>
              <h3 css={`
                  margin: 0;
                  color: var(--darkColor0);
                `}
              >
                {title}
              </h3>
            </div>
            {rule["type"] && (
              <PictoTypeAide
                $style={style}
                $expanded={expanded}
              >
                <span className="icon"></span>
                <span>{rule["type"]}</span>
              </PictoTypeAide>
            )}
          </header>
          {children}
          <AideCTAs {...{
              dottedName, 
              setSearchParams,
              situation,
              answeredQuestions,
              expanded
            }} 
          />
        </Card>
      )}
    </section>
  )
}

export const PictoTypeAide = styled.div`
  width: fit-content;
  color: ${(p) => p.$style.color};
  display: flex;
  flex-direction: column;
  align-items: ${(p) => p.$expanded ? "flex-start": "flex-end"};
  .icon {
    padding: 1rem;
    background: url('${(p) => p.$style.icon.src}') ${(p) => p.$style.backgroundColor} no-repeat center;
    border: 1px solid ${(p) => p.$style.borderColor};
    border-radius: 5px;
    ${(p) => p.$expanded ? "margin: auto;" : ""}
  }
  span {
    font-size: ${(p) => p.$expanded ? "80%": "60%"};
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
