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
