import Link from 'next/link'
import { encodeSituation } from './publicodes/situationUtils'
import { CTA, CTAWrapper } from './UI'
import { omit } from './utils'
import { push } from '@socialgouv/matomo-next'

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
    <CTAWrapper $justify="start">
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
          onClick={() => push(["trackEvent", "Simulateur Principal", "Clic", "retour choix parcours"]) } 
        >⬅ Retour</Link>
      </CTA>
    </CTAWrapper>
  )
}

