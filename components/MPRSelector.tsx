import Result, { Results } from '@/components/Result'
import { useMemo } from 'react'
import css from './css/convertToJs'
import { encodeDottedName, encodeSituation } from './publicodes/situationUtils'

export default function MPRSelector({
  setSearchParams,
  situation,
  currentQuestion,
  answeredQuestions,
  rules,
  engine,
}) {
  const nextLink = (value) => {
    const url = setSearchParams(
      { objectif: encodeDottedName(value) },
      'url',
      false,
    )
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
  console.log(
    'result 2',
    mpraEvaluation,
    mprgEvaluation,
    engine.evaluate('gestes . ventilation . double flux').nodeValue,
  )

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

      <Results>
        <Result
          index={1}
          key={'acc'}
          openByDefault={true}
          {...{
            engine: engine.setSituation(situation),
            isFinal: !currentQuestion,
            rules,
            dottedName: 'MPR . accompagnée',
            url: nextLink(`MPR . accompagnée`),
          }}
        />
        <Result
          index={2}
          key={'non acc'}
          openByDefault={true}
          {...{
            engine: engine.setSituation(situation),
            isFinal: !currentQuestion,
            dottedName: 'MPR . non accompagnée',
            hideNumeric: true,
            rules,
            url: nextLink(`MPR . non accompagnée`),
          }}
        />
      </Results>
    </div>
  )
}
