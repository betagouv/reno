import Image from 'next/image'
export default function Condition({}) {
  return (
    <div
      css={`
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        p {
          width: 80%;
          border-left: 3px solid var(--lighterColor);
          padding-left: 0.6rem;
        }
        img {
          width: 2rem;
          height: auto;
          margin-right: 1rem;
        }
        margin-top: 3vh;
      `}
    >
      <Image
        src={`/information.svg`}
        width="10"
        height="10"
        alt="Icône d'information"
      />
      <p>
        Pour bénéficier de la prime sur l'audit énergétique, les gestes
        d'isolation, de ventilation et de dépose de cuve à fioul, vous devrez
        choisir au moins un geste de remplacement de chauffage ou eau chaude
        sanitaire.
      </p>
    </div>
  )
}
