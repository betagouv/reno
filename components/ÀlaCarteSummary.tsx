import Link from 'next/link'
import { CTA, CTAWrapper, Card } from './UI'
import GestesPreview from './mprg/GestesPreview'

export default function ÀlaCarteSummary({ engine, rules, url, situation }) {
  const isNotApplicable = false
  return (
    <section>
      <header>
        <h3>Rénover à la carte</h3>
        <p
          css={`
            margin-top: 1.4rem;
          `}
        >
          Rénovez progressivement via un bouquet de gestes subventionnés.
        </p>
      </header>
      <Card
        css={`
          min-height: 10rem;
          max-width: 40rem;
        `}
      >
        <GestesPreview
          {...{
            rules,
            dottedNames: [
              'gestes . recommandés . audit',
              'gestes . chauffage . PAC . air-eau',
              'gestes . isolation . murs extérieurs',
            ],
            engine,
            situation,
          }}
        />
        <div
          css={`
            display: ${!isNotApplicable && url ? 'visible' : 'none'};
            > div {
              margin-bottom: 0.3rem;
              margin-top: 1.6rem;
            }
          `}
        >
          <CTAWrapper $justify="start">
            <CTA $fontSize="normal">
              <Link href={url}>
                <span>Voir tous les gestes disponibles</span>
              </Link>
            </CTA>
          </CTAWrapper>
          {false && ( // inclure les mots clefs qui feront tilt pour les citoyens qui ont déjà entendu parler de ça et viennent les trouver ici ?
            <p
              css={`
                color: #666;
                font-size: 90%;
              `}
            >
              MaPrimeRénov' par gestes + CEE
            </p>
          )}
          {/* <span>
            <a
              target="_blank"
              href="https://www.service-public.fr/particuliers/vosdroits/F35083"
            >
              En savoir plus sur ce parcours
            </a>
            .
          </span> */}
        </div>
      </Card>
    </section>
  )
}
