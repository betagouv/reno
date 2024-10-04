import Link from 'next/link';
import { CTAWrapper, CTA } from '../UI'; // Supposant que vous avez ces composants disponibles.

export default function AideCTAs({ detailsLink = "#", codeLink = "#" }) {
  return (
    <CTAWrapper $justify="center" css={`flex-wrap: wrap;`}>
      <CTA css={`margin: 0.5rem 0.2rem !important;`} $fontSize="normal" $importance="emptyBackground">
        <Link href={detailsLink}>Voir le détail sur l'aide</Link>
      </CTA>
      <CTA css={`margin: 0.5rem 0.2rem;`} $fontSize="normal">
        <Link href={codeLink}>+ Ajouter à ma synthèse</Link>
      </CTA>
    </CTAWrapper>
  )
}

