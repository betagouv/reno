import css from '@/components/css/convertToJs'
import Result, { Results } from '@/components/Result'

export default function ResultsBlock({
  engine,
  rules,
  currentQuestion,
  situation,
}) {
  return (
    <div
      style={css`
        margin-top: 1vh;
      `}
    >
      <h2>Votre Prime Rénov'</h2>
      <Results>
        <Result
          started={started}
          index={1}
          key={'acc'}
          {...{
            engine: engine.setSituation(situation),
            isFinal: !currentQuestion,
            rules,
            dottedName: 'MPR . accompagnée',
          }}
        />
        <span>OU</span>
        <Result
          started={started}
          index={2}
          key={'non acc'}
          {...{
            engine: engine.setSituation(situation),
            isFinal: !currentQuestion,
            dottedName: 'MPR . non accompagnée',
            hideNumeric: !currentQuestion?.startsWith('gestes . '),
            rules,
          }}
        />
      </Results>
    </div>
  )
}
