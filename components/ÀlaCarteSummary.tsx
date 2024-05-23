import css from '@/components/css/convertToJs'
import Link from 'next/link'
import { CTA, CTAWrapper, Card } from './UI'
import { ExplicationMPRG } from './explications/Éligibilité'
import GestesPreview from './mprg/GestesPreview'

export default function ÀlaCarteSummary({ engine, url, situation }) {
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
          color: ${fail ? '#888' : 'inherit'};
        `}
      >
        <h4
          style={css`
            font-weight: 400;
            margin: 1rem 0 0rem;
            font-size: 120%;
          `}
          dangerouslySetInnerHTML={{ __html: rule.titreHtml }}
        />
        {fail && (
          <div
            css={`
              margin: 1rem 0;
              color: black;
              text-align: center;
            `}
          >
            <ExplicationMPRG {...{ engine, situation }} />
          </div>
        )}

        {!fail ? (
          <GestesPreview
            {...{
              rules,
              inactive: fail,
              dottedNames: [
                'gestes . recommandés . audit',
                'gestes . chauffage . PAC . air-eau',
                'gestes . isolation . murs extérieurs',
              ],
              engine,
              situation,
            }}
          />
        ) : (
          <span>
            <a
              target="_blank"
              href="https://www.service-public.fr/particuliers/vosdroits/F35083"
            >
              En savoir plus sur ce parcours
            </a>
            .
          </span>
        )}
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
                {MPRA ? (
                  'Découvrir le détail'
                ) : (
                  <span>
                    Voir les <strong>20</strong> gestes disponibles
                  </span>
                )}
              </Link>
            </CTA>
          </CTAWrapper>
        </div>
      </Card>
    </section>
  )
}
