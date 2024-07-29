import Link from 'next/link'
import { encodeSituation } from './publicodes/situationUtils'
import { CTA, CTAWrapper } from './UI'
import { omit } from './utils'

export default function BtnBackToParcoursChoice({
  setSearchParams,
  situation,
  answeredQuestions,
}) {
  const backUrl = setSearchParams(
    {
      ...encodeSituation(
        omit(["parcours d'aide"], situation),
        false,
        answeredQuestions,
      ),
    },
    'url',
    true,
  )

  return (
    <CTAWrapper $justify="end">
      <CTA
        $fontSize="normal"
        $importance="secondary"
        css={`
          a {
            padding: 0.5rem 0.8rem;
          }
        `}
      >
        <Link href={backUrl}>⬅ Retour au choix du parcours</Link>
      </CTA>
    </CTAWrapper>
  )
}

