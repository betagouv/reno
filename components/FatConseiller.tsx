import Image from 'next/image'
import conseillerIcon from '@/public/conseiller.png'
import checkIcon from '@/public/check.svg'
import MarSearch from '@/app/trouver-accompagnateur-renov/MarSearch'
import { CTA, CTAWrapper } from './UI'
import { push } from '@socialgouv/matomo-next'

export default function FatConseiller({ situation, margin, titre, texte }) {
  return (
    <>
      <h3>{titre}</h3>
      <p dangerouslySetInnerHTML={{ __html: texte }} />
      <details
        css={`
          margin: 3rem auto;
          ${margin && margin == 'small' && `margin: 1rem auto;`}
          background: var(--lightestColor);
          padding: 1rem;
          border: 1px solid #d0d0ed;
          summary {
            margin: 0 auto;
            border-radius: 0.4rem;
            width: fit-content;
            max-width: 100%;
            list-style-type: none;
          }
          summary::-webkit-details-marker {
            display: none;
          }
          > section {
            margin: 0;
            > div {
              margin-top: 0;
            }
          }
        `}
      >
        <summary>
          <div
            css={`
              display: flex;
              justify-content: space-around;
              align-items: center;
            `}
          >
            <Image
              src={conseillerIcon}
              alt="illustration espace conseiller France Rénov'"
              css={`
                max-width: 9rem;
                height: auto;
                margin: 1.6rem 3rem 1.6rem 0rem;

                @media (max-width: 600px) {
                  display: none;
                }
              `}
            />
            <div
              css={`
                > img {
                  margin: auto;
                  display: block;
                  padding: 1rem;
                }
                h3 {
                  text-align: left;
                  font-size: 140%;
                  margin: 0 0 0.6rem 0;
                }
                p {
                  margin: 0;
                  font-size: 100%;
                }
              `}
            >
              <h3>
                Contacter votre conseiller <span>France&nbsp;Rénov'</span>
              </h3>
              <ul
                css={`
                  list-style-type: none;
                  padding: 0;
                  li {
                    list-style-image: url(${checkIcon.src});
                    margin: 1rem 0;
                  }
                  img {
                    width: 1.2rem;
                    height: auto;
                    vertical-align: sub;
                  }
                `}
              >
                {' '}
                {[
                  'Service indépendant, neutre et gratuit !',
                  'Conseils personnalisés pour votre projet',
                ].map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
              <CTAWrapper
                $justify="center"
                css={`
                  margin-bottom: 0;
                `}
              >
                <CTA
                  css={`
                    padding: 1rem;
                    text-wrap: wrap;
                    text-align: center;
                    width: 100%;
                  `}
                  $fontSize="normal"
                  onClick={() =>
                    push([
                      'trackEvent',
                      'Simulateur Principal',
                      'Clic',
                      'trouver conseiller',
                    ])
                  }
                >
                  Trouver mon conseiller local
                </CTA>
              </CTAWrapper>
            </div>
          </div>
        </summary>
        <section>
          <MarSearch situation={situation} what={'trouver-conseiller-renov'} />
        </section>
      </details>
    </>
  )
}
