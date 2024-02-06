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
        </ConstraintedParagraphs>
      </Section>
    </Main>
  )
}
