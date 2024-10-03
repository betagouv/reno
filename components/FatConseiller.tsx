import Image from 'next/image'
import conseillerIcon from '@/public/rendez-vous.svg'
import MarSearch from '@/app/trouver-accompagnateur-renov/MarSearch'

export default function FatConseiller({ situation, margin }) {
  return (
    <details
      css={`
        margin: 3rem auto;
        ${margin && margin == "small" && `margin: 1rem auto;`}
        width: fit-content;
        summary {
          margin: 0 auto;
          border-radius: 0.4rem;
          filter: drop-shadow(0px 1px 7px #d83a3440);
          padding: 2rem 1.6rem;
          background: var(--color);
          color: white;

          font-size: 150%;
          width: fit-content;
          max-width: 100%;
          list-style-type: none;
          p {
            line-height: 1.8rem;
          }
        }
        > section {
          padding-top: 1rem;
          margin: 0;
          padding-left: 1rem;
          margin-left: 3px;
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
              margin: 0 1.8rem 0 1rem;
              width: 4rem;
              height: auto;
              background: white;
              border-radius: 0.4rem;
              padding: 0.4rem;
            }
            display: flex;
            align-items: center;
            justify-content: center;
            p {
              margin: 0;
            }
          `}
        >
          <Image
            src={conseillerIcon}
            alt="Image qui représente un rendez-vous pris dans un calendrier"
          />
          <p>
            Trouver mon conseiller{' '}
            <span>
              <strong>France</strong>&nbsp;
              <strong css="color: #d83a34; margin-bottom: -.1rem">
                Rénov'
              </strong>
            </span>
          </p>
        </div>
        <ul
          css={`
            margin: 0 auto;
            width: fit-content;
            padding-left: 0;
            margin-top: 1rem;
            font-size: 65%;
            list-style-type: none;
            img {
              width: 1.2rem;
              height: auto;
              vertical-align: sub;
            }
          `}
        >
          {' '}
          {[
            'Un service neutre et gratuit',
            'Un conseil local et personnalisé',
          ].map((text) => (
            <li key={text}>
              <Image
                src={'/check-green-hybrid.svg'}
                alt="coche verte"
                width="10"
                height="10"
              />{' '}
              {text}
            </li>
          ))}
        </ul>
      </summary>
      <section>
        <MarSearch situation={situation} what={'trouver-conseiller-renov'} />
      </section>
    </details>
  )
}
