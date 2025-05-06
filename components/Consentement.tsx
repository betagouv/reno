import { QuestionHeader } from '@/app/simulation/QuestionHeader'
import { AnswerWrapper, QuestionCard, Subtitle } from './InputUI'
import { CTA, CTAWrapper, Card } from './UI'
import { BlueEm } from '@/app/LandingUI'
import { postMessageEligibilityDone } from '@/utils/iframe'

export default function Consentement({ setConsent, situation }) {
  const name = "J'agis"
  return (
    <Card style={{ margin: '1rem 1rem' }}>
      <QuestionHeader>
        <div>
          <small>Une dernière question</small>

          <h1>
            Acceptez-vous de partager votre simulation avec{' '}
            <BlueEm>{name}</BlueEm> ?
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
            <button
              onClick={() => {
                postMessageEligibilityDone(situation)
                // more for user comprehension than real need, postMessage should be synchronous
                setTimeout(() => {
                  setConsent(true)
                }, 300)
              }}
            >
              Oui
            </button>
          </CTA>
          <CTA $fontSize="normal" $importance="primary">
            <button onClick={() => setConsent(false)}>Non</button>
          </CTA>
        </CTAWrapper>
      </AnswerWrapper>
    </Card>
  )
}
