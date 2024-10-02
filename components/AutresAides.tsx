import autresAides from '@/app/règles/autres-aides.yaml'
import Link from 'next/link'
import { CTA, CTAWrapper, Card } from './UI'
import { useEffect } from 'react'

export default function AutresAides() {

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 600
      const detailsElements = document.querySelectorAll('details')
      
      detailsElements.forEach(details => {
        if (isMobile) {
          details.removeAttribute('open') // Close <details> on mobile
        } else {
          details.setAttribute('open', true) // Keep <details> open on larger screens
        }
      })
    }

    // Attach resize listener
    window.addEventListener('resize', handleResize)

    // Call it once to apply the logic on initial render
    handleResize()

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <section
      css={`
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
      <div
        css={`
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          @media (max-width: 600px) {
            justify-content: center;
          }
          flex-wrap: wrap;
        `}
      >
        {autresAides
          .filter((aide) => aide.implémentée !== 'oui')
          .map((aide) => (
            <details
              key={aide.nom}
              css={`
                width: 14rem;
                @media (max-width: 600px) {
                  width: 100%;
                }
                background: white;
                margin: 0 0 1rem 0;
                padding: 1.2vh calc(.5rem + 1vw);
                border: 2px solid #dfdff1;
                border-radius: 0.3rem;
                p {
                  margin: 0.8rem 0;
                  line-height: 1.3rem;
                  small {
                  }
                }
                display: flex;
                flex-direction: column;
                justify-content: space-between;
              `}
            >
              <summary css={`font-weight:bold;`}>{aide.nom}</summary>
              <div>
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
              </div>
            </details>
          ))}
      </div>
    </section>
  )
}
