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
          En 2024, les aides à la rénovation énergétique des logements sont
          organisées autour de deux grands dispositifs nationaux.
        </p>
        <VisualExplanation />

        <p>
          Ces deux aides peuvent être cumulées avec des aides locales et
          d’autres dispositifs (EcoPTZ, Crédit d’impôt…).
        </p>
        <p>
          <strong>
            Ce simulateur vous aide à les comprendre et à choisir le dispositif
            qui vous convient le mieux.
          </strong>
        </p>
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
