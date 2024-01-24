import css from '@/components/css/convertToJs'
import Result, { Results } from '@/components/Result'
import { Section } from '@/components/UI'

export default function ResultsBlock({
  engine,
  rules,
  currentQuestion,
  validatedSituation,
}) {
  const targets = rules['aides'].somme,
    evaluations = targets.map((dottedName) =>
      engine.setSituation(validatedSituation).evaluate(dottedName),
    )
  console.log('results', evaluations)

  return (
    <Section>
      <Results>
        <Result
          index={1}
          key={'acc'}
          {...{
            engine: engine.setSituation(validatedSituation),
            isFinal: !currentQuestion,
            rules,
            dottedName: 'MPR . accompagnée',
          }}
        />
        <Result
          index={2}
          key={'non acc'}
          {...{
            engine: engine.setSituation(validatedSituation),
            isFinal: !currentQuestion,
            dottedName: 'MPR . non accompagnée',
            hideNumeric: true,
            rules,
          }}
        />
      </Results>
    </Section>
  )
}
