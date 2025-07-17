import DPELabel from '@/components/dpe/DPELabel'
import { PrimeStyle } from '@/components/UI'
import css from '@/components/css/convertToJs'
import Link from 'next/link'
import calculatorIcon from '@/public/calculator-empty.svg'
import Image from 'next/image'

export default function ExampleBlock() {
  return (
    <section
      style={css`
        background: var(--lightestColor);
        padding: 0.1rem 1rem;
        border-radius: 1rem;
      `}
    >
      <Image
        src={calculatorIcon}
        alt="Icône calculette"
        style={css`
          width: 6rem;
          height: 2rem;
          margin: 1rem auto;
        `}
      />
      <p>
        Par exemple : un couple au revenu modeste à Rennes (donc au revenu
        inférieur à 38 720 €) dans une maison au DPE <DPELabel index="4" />, qui
        ciblerait un <DPELabel index="2" /> en faisant 30 000 € de travaux (HT)
        pourra toucher <PrimeStyle>18 000 €</PrimeStyle> d'aides au titre de MaPrimeRénov' ⭐️ Parcours Accompagné ⭐️.
      </p>
      <p>
        Il pourra financer le reste à charge de 13 650 € (TTC) avec un éco-PTZ,
        et tester son éligibilité aux autres aides publiques sur{' '}
        <Link href="/simulation">Mes Aides Réno</Link>.
      </p>
    </section>
  )
}
