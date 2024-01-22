import ResultsBlock from '@/app/simulation/ResultsBlock'
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
    const url = setSearchParams(newSituation, true, false)
    return url
  }

  console.log('mprselector', situation)
  const mpraEvaluation = engine.evaluate('MPR . accompagnée')
  const mprgEvaluation = engine.evaluate('MPR . non accompagnée'),
    mpra = mpraEvaluation.nodeValue,
    mprg = mprgEvaluation.nodeValue
  console.log('mprselector', mpraEvaluation, mprgEvaluation)
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
          validatedSituation: situation,
          showIfNull: false,
        }}
      />

      <CTAWrapper>
        <CTA href={nextLink(`accompagnée`)}>Suivant</CTA>
      </CTAWrapper>
    </div>
  )
}
