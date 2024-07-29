import autresAides from '@/app/règles/autres-aides.yaml'
import Link from 'next/link'
import { CTA, CTAWrapper, Card } from './UI'

export default function AutresAides() {
  return (
    <section
      css={`
        margin-top: 4vh;
        > p {
          margin-bottom: 1vh;
        }
      `}
    >
      <h3>Les autres aides à la rénovation</h3>
      <p>
        Nous ne proposons pas encore leur calcul sur Mes Aides Réno, mais
        d'autres aides peuvent être disponibles pour rénover votre logement.
      </p>
      <ol
        css={`
          padding-left: 0;
          list-style-type: none;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          li {
            margin: 1rem;
          }
        `}
      >
        {autresAides
          .filter((aide) => aide.implémentée !== 'oui')
          .map((aide) => (
            <li key={aide.nom}>
              <Card
                css={`
                  width: 14rem;
                  height: 20rem;
                  padding: 0.2rem 1rem;
                  p {
                    margin-bottom: 0.8rem 0;
                    line-height: 1.3rem;
                    small {
                    }
                  }
                  h4 {
                    margin-top: 1.6rem;
                  }
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                `}
              >
                <h4>{aide.nom}</h4>
                <p>
                  <small>{aide.description}</small>
                </p>
                <CTAWrapper
                  css={`
                    margin: 0 0 0.6rem 0;
                  `}
                >
                  <CTA $fontSize="normal" $importance="secondary">
                    <Link href={aide.lien}>En savoir plus</Link>
                  </CTA>
                </CTAWrapper>
              </Card>
            </li>
          ))}
      </ol>
    </section>
  )
}
