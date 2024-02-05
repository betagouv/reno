import VisualExplanation from '@/app/VisualExplanation'
import css from '@/components/css/convertToJs'
import Link from 'next/link'
import {
  ConstraintedParagraphs,
  CTA,
  CTAWrapper,
  Main,
  Section,
} from '@/components/UI'

export const metadata: Metadata = {
  title: 'Introduction - Mes aides réno',
}
export default function Introduction() {
  return (
    <Main>
      <Section>
        <ConstraintedParagraphs>
          <p>
            En 2024, les aides à la rénovation énergétique des logements sont
            organisées autour de deux grands dispositifs nationaux, Ma Prime
            Rénov' <strong>accompagnée</strong>, et Ma Prime Rénov'{' '}
            <strong>par gestes</strong>.
          </p>

          <p>
            Ces deux aides peuvent être cumulées avec des aides locales et
            d’autres dispositifs (Éco-prêt à taux zéro, Crédit d’impôt…).
          </p>
          <p>
            <strong>
              Ce simulateur vous aide à les comprendre et à choisir le
              dispositif qui vous convient le mieux.
            </strong>
          </p>
          <CTAWrapper>
            <CTA $importance="secondary">
              <Link href="/" title="Retour en arrière">
                ←
              </Link>
            </CTA>
            <CTA>
              <Link href="/simulation" title="Aller à l'étape suivante">
                Suivant
              </Link>
            </CTA>
          </CTAWrapper>
          <VisualExplanation />
        </ConstraintedParagraphs>
      </Section>
    </Main>
  )
}
