import Link from 'next/link'
import { encodeSituation } from './publicodes/situationUtils'
import { CTA, CTAWrapper } from './UI'
import { push } from '@socialgouv/matomo-next'

export default function BtnBackToParcoursChoice({
  setSearchParams,
  situation,
  answeredQuestions,
  text = 'Retour',
}) {
  const backUrl = setSearchParams(
    {
      ...encodeSituation(situation, false, answeredQuestions),
    },
    'url',
    true,
  )

  return (
    <CTAWrapper
      $justify="start"
      css={`
        margin-top: 0;
      `}
    >
      <CTA
        $fontSize="normal"
        $importance="emptyBackground"
        css={`
          a {
            padding: 0.5rem 0.8rem;
          }
        `}
      >
        <Link
          href={backUrl}
          onClick={() =>
            push([
              'trackEvent',
              'Simulateur Principal',
              'Clic',
              'retour choix parcours',
            ])
          }
        >
          ⬅ {text}
        </Link>
      </CTA>
    </CTAWrapper>
  )
}
