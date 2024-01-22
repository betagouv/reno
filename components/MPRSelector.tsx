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

  const mpra = engine.evaluate('MPR . accompagnée').nodeValue
  const mprg = engine.evaluate('MPR . non accompagnée').nodeValue

  console.log('mprselector', mpra, mprg)
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
        <div>
          <p>
            Vous êtes éligible au deux parcours, le parcours accompagné et le
            parcours par gestes. Vous devez choisir l'un des parcours.
          </p>
        </div>
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
