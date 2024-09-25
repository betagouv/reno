import rules from '@/app/règles/rules'
import informationIcon from '@/public/information.svg'
import starIcon from '@/public/star-full-gold.svg'
import Image from 'next/image'
import { CTA, Card } from '../UI'
import { encodeDottedName } from '../publicodes/situationUtils'
import { uncapitalise0 } from '../utils'
import chainIcon from '@/public/link-chain.svg'

export default function AideAmpleur({ dottedName, children, level = null }) {
  const rule = rules[dottedName]
  const isFavorite = rule.favorite === 'oui',
    title =
      (rule.marque + ' - ' || '') +
      uncapitalise0(rule['complément de marque'] || '')

  return (
    <section
      id={'aide-' + encodeDottedName(dottedName)}
      css={
        level === 2 &&
        `
		  border-left: 2px dashed #dfdff1;
		  padding-top: .6rem;
		  padding-left: 1rem;
		  position: relative;
		  `
      }
    >
      {level === 2 && (
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
      <header
        css={`
          > h3 {
            margin: 0;
            color: var(--darkColor0);
          }
          margin: 4vh 0 0;
          font-size: 140%;
          ${level === 2 && 'font-size: 110%;'}
          img {
            width: 1.3rem;
            height: auto;
            margin-right: 1rem;
          }
          display: flex;
          align-items: center;
        `}
      >
        {isFavorite && (
          <Image
            src={starIcon}
            alt="Icône étoile signalant le parcours recommandé"
          />
        )}
        <h3>{title}</h3>
      </header>
      <Card>{children}</Card>
    </section>
  )
}

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
