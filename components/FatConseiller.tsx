import Image from 'next/image'
import conseillerIcon from '@/public/conseiller.png'
import checkIcon from '@/public/check.svg'
import MarSearch from '@/app/trouver-accompagnateur-renov/MarSearch'
import { CTA, CTAWrapper } from './UI'

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
                height: 100%;
                padding: 3rem;
                object-fit: cover;
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
                  font-size: 110%;
                  margin: 0 0 0.6rem 0;
                }
                p {
                  margin: 0;
                  font-size: 100%;
                }
              `}
            >
              <h3>
                Contacter un conseiller{' '}
                <span>
                  <strong>France</strong>&nbsp;
                  <strong css=" margin-bottom: -.1rem">Rénov'</strong>
                </span>
              </h3>
              <p>
                Avant la réalisation de vos travaux, un conseiller
                France&nbsp;Rénov’ vous accompagne gratuitement.
              </p>
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
                  'Service indépendant, neutre et gratuit!',
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
