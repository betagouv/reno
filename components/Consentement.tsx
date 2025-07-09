import { BlueEm } from '@/app/LandingUI'
import { QuestionHeader } from '@/app/simulation/QuestionHeader'
import { postMessageEligibilityDone } from '@/utils/iframe'
import { AnswerWrapper, Subtitle } from './InputUI'
import { CTA, CTAWrapper, Card } from './UI'

export interface ConsentementProps {
  setConsent: (consent: boolean) => void
  situation: object
  sendDataToHost: {
    hostTitle: string
  }
}

export default function Consentement({
  setConsent,
  situation,
  sendDataToHost,
}: ConsentementProps) {
  const { hostTitle } = sendDataToHost
  const handleElibilityDone = (consent: boolean) => {
    postMessageEligibilityDone(consent ? situation : {})
    // more for user comprehension than real need, postMessage should be synchronous
    setTimeout(() => {
      setConsent(consent)
    }, 300)
  }

  return (
    <Card style={{ margin: '1rem 1rem' }}>
      <QuestionHeader>
        <div>
          <small>Une dernière question</small>

          <h1>
            Acceptez-vous de partager votre simulation avec{' '}
            <BlueEm>{hostTitle}</BlueEm> ?
          </h1>
          <Subtitle>
            <p>
              Dans tous les cas, vous obtiendrez vos résultats sur l'écran
              suivant.
            </p>
          </Subtitle>
        </div>
      </QuestionHeader>
      <AnswerWrapper>
        <CTAWrapper $justify="flex-start">
          <CTA $fontSize="normal" $importance="primary">
            <button onClick={() => handleElibilityDone(true)}>Oui</button>
          </CTA>
          <CTA $fontSize="normal" $importance="primary">
            <button onClick={() => handleElibilityDone(false)}>Non</button>
          </CTA>
        </CTAWrapper>
      </AnswerWrapper>
    </Card>
  )
}
