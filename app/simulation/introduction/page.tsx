import VisualExplanation from '@/app/VisualExplanation'
import css from '@/components/css/convertToJs'
import { CTA, Main, Section } from '@/components/UI'

export const metadata: Metadata = {
  title: 'Introduction - Mes aides réno',
}
export default function Introduction() {
  return (
    <Main>
      <Section>
        <p>
          En 2024, tous les foyers peuvent bénéficier d'une aide minimum,
          quelque soit leur revenu, grâce à un parcours accompagné pour des
          rénovations ambitieuses de deux sauts de DPE.
        </p>
        <p>
          Deux dispositifs Ma Prime Rénov' existent. Ce calculateur vous aide à
          les comprendre et à choisir celui qui vous convient.
        </p>
        <VisualExplanation />

        <div
          style={css`
            text-align: right;
            margin: 2vh 0;
          `}
        >
          <CTA href="/simulation">J'ai compris</CTA>
        </div>
      </Section>
    </Main>
  )
}
