import ResultsBlock from '@/app/simulation/ResultsBlock'
import { useMemo } from 'react'
import css from './css/convertToJs'
import { encodeSituation } from './publicodes/situationUtils'
import { CTA, CTAWrapper } from './UI'

export default function MPRSelector({
  setSearchParams,
  situation,
  currentQuestion,
  answeredQuestions,
  rules,
  engine,
}) {
  const nextLink = (value) => {
    const newSituation = encodeSituation(
      {
        ...situation,
        [currentQuestion]: value + '*',
      },
      false,
      answeredQuestions,
    )
    const url = setSearchParams(newSituation, 'url', false)
    return url
  }

  const [mpraEvaluation, mprgEvaluation] = useMemo(() => {
      const newEngine = engine.setSituation(situation)
      return [
        newEngine.evaluate('MPR . accompagnée'),
        newEngine.evaluate('MPR . non accompagnée'),
      ]
    }, [situation, engine]),
    mpra = mpraEvaluation.nodeValue,
    mprg = mprgEvaluation.nodeValue
  console.log('result 2', mpraEvaluation, mprgEvaluation)

  if (!mpra && !mprg)
    return (
      <p
        css={`
          text-decoration: underline;
          text-decoration-color: salmon;
        `}
      >
        Vous n'êtes pas éligible aux aides Ma Prime Rénov.
      </p>
    )
  return (
    <div
      style={css`
        margin-top: 0.6rem;
        width: 100%;
      `}
    >
      <h2>Votre éligibilité</h2>
      {mpra && !mprg ? (
        <p>
          Vous êtes éligible au parcours accompagné. Vous n'êtes pas éligible au
          parcours par geste.
        </p>
      ) : !mpra && mprg ? (
        <p>
          Vous n'êtes pas éligible au parcours accompagné. Vous êtes cependant
          éligible au parcours par geste.
        </p>
      ) : (
        mpra &&
        mprg && (
          <div>
            <p>
              Vous êtes éligible aux deux parcours, le parcours accompagné et le
              parcours par gestes. Vous devez choisir l'un des deux parcours.
            </p>
          </div>
        )
      )}

      <ResultsBlock
        {...{
          engine,
          rules,
          currentQuestion,
          situation,
          openByDefault: true,
        }}
      />

      <CTAWrapper>
        <CTA href={nextLink(`accompagnée`)}>Suivant</CTA>
      </CTAWrapper>
    </div>
  )
}
