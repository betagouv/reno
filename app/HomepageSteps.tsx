'use client'
import { Content, Wrapper } from '@/components/explications/ExplicationUI'
import useIsInIframe from '@/components/useIsInIframe'
import { HomeList } from './LandingUI'
import { push } from '@socialgouv/matomo-next'

export default function HomepageSteps() {
  const isInIFrame = useIsInIframe()
  if (isInIframe) {
    push(['trackEvent', 'Iframe', 'Page', 'Home'])
  }
  return (
    !isInIFrame && (
      <Wrapper $background="white" $noMargin={true}>
        <Content>
          <HomeList>
            <li>
              <strong>1</strong>
              <h3>Je réponds à un questionnaire simplifié</h3>
              <p>
                6 questions pour évaluer votre éligibilité et estimer le montant
                le vos aides.
              </p>
            </li>
            <li>
              <strong>2</strong>
              <h3>Je découvre le montant de mes aides</h3>
              <p>
                Et j’affine mon projet pour obtenir un montant d’enveloppe
                global pour mes travaux.
              </p>
            </li>
            <li>
              <strong>3</strong>
              <h3>J’exporte le résultat de ma simulation</h3>
              <p>
                Pour le partager avec mon conseiller local France Rénov’, mes
                proches ou mes artisans.
              </p>
            </li>
          </HomeList>
        </Content>
      </Wrapper>
    )
  )
}
