import starIcon from '@/public/star-full-gold.svg'
import { Card } from '../UI'
import informationIcon from '@/public/information.svg'
import Image from 'next/image'
import rules from '@/app/règles/rules'
import { uncapitalise0 } from '../utils'

export default function AideAmpleur({ dottedName, children }) {
  const rule = rules[dottedName]
  const isFavorite = rule.favorite === 'oui',
    title =
      (rule.marque + ' - ' || '') +
      uncapitalise0(rule['complément de marque'] || '')
  return (
    <section>
      <header
        css={`
          > h3 {
            margin: 0;
            color: var(--darkColor0);
          }
          margin: 4vh 0 0;
          font-size: 140%;
          img {
            width: 1.3rem;
            height: auto;
            margin-right: 1rem;
          }
          display: flex;
          align-items: center;
        `}
      >
        {' '}
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
