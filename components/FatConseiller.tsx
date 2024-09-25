import Image from 'next/image'
import conseillerIcon from '@/public/rendez-vous.svg'
import MarSearch from '@/app/trouver-accompagnateur-renov/MarSearch'

export default function FatConseiller({ situation }) {
  return (
    <details
      css={`
        margin: 3rem auto;

        width: fit-content;
        summary {
          margin: 0 auto;
          border-radius: 0.4rem;
          filter: drop-shadow(0px 1px 7px #d83a3440);
          padding: 2rem 1.6rem;
          background: var(--color);
          color: white;

          font-size: 160%;
          img {
            margin-right: 1.4rem;
            width: 4rem;
            height: auto;
            background: white;
            border-radius: 0.4rem;
            padding: 0.4rem;
          }
          width: fit-content;
          list-style-type: none;
          display: flex;
          align-items: center;
          justify-content: center;
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
        <Image
          src={conseillerIcon}
          alt="Image qui représente un rendez-vous pris dans un calendrier"
        />
        <p>
          Trouver mon conseiller{' '}
          <span>
            <strong>France</strong>&nbsp;
            <strong css="color: #d83a34; margin-bottom: -.1rem">Rénov'</strong>
          </span>
        </p>
      </summary>
      <section>
        <MarSearch situation={situation} what={'trouver-conseiller-renov'} />
      </section>
    </details>
  )
}
