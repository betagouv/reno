import Image from 'next/image'
import conseillerIcon from '@/public/conseiller.png'
import checkIcon from '@/public/check.svg'
import MarSearch from '@/app/trouver-accompagnateur-renov/MarSearch'
import { CTA, CTAWrapper } from './UI'

export default function FatConseiller({ situation, margin }) {
  return (
    <details
      css={`
        margin: 3rem auto;
        ${margin && margin == "small" && `margin: 1rem auto;`}
        background: var(--lightestColor);
        padding: 1rem;
        border: 1px solid #D0D0ED;
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
            > img {
             margin: auto;
             display: block;
             padding: 1rem;
            }
            h3 {
              text-align: left;
              font-size: 100%;
              margin: 0;
            }
            p {
              margin: 0;
            }
          `}
        >
          <h3>
            Contacter un conseiller{' '}
            <span>
              <strong>France</strong>&nbsp;
              <strong css="color: #d83a34; margin-bottom: -.1rem">
                Rénov'
              </strong>
            </span>
          </h3>
          <p>Avant la réalisation de vos travaux, un conseiller France Rénov’ vous accompagne gratuitement.</p>
        </div>
        <div css={`
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          align-items: center;
          `}>
          <Image
            src={conseillerIcon}
            alt="illustration espace conseiller France Rénov'"
          />
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
              'Toutes les réponses à vos questions !',
            ].map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </div>
        <CTAWrapper $justify="center">
          <CTA
            css={`
              padding: 1rem;
              text-wrap: wrap;
              text-align: center;
            `}
            $fontSize="normal"
          >
            Afficher les coordonnées de mon conseiller local
          </CTA>
        </CTAWrapper>
      </summary>
      <section>
        <MarSearch situation={situation} what={'trouver-conseiller-renov'} />
      </section>
    </details>
  )
}
