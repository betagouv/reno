import DPELabel from '../dpe/DPELabel'
import checkIcon from '@/public/check.svg'
import flag from '@/public/flag-filled.svg'
import Image from 'next/image'
import { CTA } from '../UI'
import Link from 'next/link'

export default function AmpleurModuleBanner({
  depuisModule,
  situation,
  setSearchParams,
  remaining,
}) {
  if (!depuisModule) return null

  return (
    <section
      css={`
        margin: 0 1rem;
        > div {
          h2 {
            margin: 0;
            margin-bottom: 0.6rem;
            font-size: 120%;
          }
          > section  {
            padding: 0.8rem 1rem;
            background: #e8edff;
            border-radius: 5px;
          }
          margin: 0 auto;
          img {
            margin-right: 0.1rem;
            margin-bottom: -0.05rem;
            width: 1rem;
            height: auto;
            vertical-align: center;
          }
          strong {
            color: var(--color);
            font-style: normal;
            font-weight: bold;
          }
        }
      `}
    >
      <div>
        <h2>
          Simulation pour l'annonce immobilière
          <City situation={situation} />
          <DPE situation={situation} />
        </h2>
        <section>
          <p>
            <Image src={checkIcon} alt="Icône case cochée" /> Grâce aux
            informations de l'annonce, nous avons pré-rempli{' '}
            {Object.keys(situation).length} réponses.
          </p>
          <p>
            <Image src={flag} alt="Icône de drapeau représentant l'objectif" />{' '}
            Il reste seulement <strong>{remaining} questions</strong> pour
            calculer vos aides.
          </p>

          <Link
            className="fr-btn fr-btn--secondary"
            href={setSearchParams({ depuisModule: undefined }, 'url')}
          >
            OK
          </Link>
        </section>
      </div>
    </section>
  )
}

const City = ({ situation }) => {
  const name = situation['logement . commune . nom']
  if (!name) return null
  const cleanName = name.replace(/"/g, '')
  return <span> à {cleanName}</span>
}
const DPE = ({ situation }) => {
  const value = situation['DPE . actuel']
  if (!value) return null

  return (
    <span>
      {' '}
      de DPE <DPELabel index={value - 1} />
    </span>
  )
}
