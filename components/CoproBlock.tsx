import closeIcon from '@/public/remix-close-empty.svg'
import Image from 'next/image'

export default function CoproBlock({ setCopro, copro }) {
  console.log('indigo copro', copro)
  return (
    <section
      css={`
        position: relative;
        margin-bottom: 0.4rem;
      `}
    >
      <button
        onClick={() => setCopro(null)}
        title="Défaire le choix de copropriété"
        css={`
          background: none;
          border: none;
          position: absolute;
          right: 0;
          top: -0.3rem;
        `}
      >
        <Image src={closeIcon} alt="Icône croix" />
      </button>
      <div>
        <div>{copro['adresse']}</div>
        <div>{copro['lotsHab']} lots d'habitation</div>
      </div>
    </section>
  )
}
