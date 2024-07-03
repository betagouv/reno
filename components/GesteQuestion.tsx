import { formatValue } from 'publicodes'
import { QuestionText } from './ClassicQuestionWrapper'
import { Prime } from './Geste'
import InputSwitch from './InputSwitch'
import { Section } from '@/components/UI'
import Input from './Input'
import { encodeSituation } from './publicodes/situationUtils'
import { useSearchParams } from 'next/navigation'
export default function GesteQuestion({
  dottedName,
  rules,
  nextQuestions,
  engine,
  situation,
  answeredQuestions,
  setSearchParams,
}) {
  const currentQuestion = nextQuestions.find((question) =>
    question.startsWith(dottedName),
  )
  const rawSearchParams = useSearchParams(),
    searchParams = Object.fromEntries(rawSearchParams.entries())

  if (!currentQuestion) return null

  const evaluation = engine.evaluate(currentQuestion),
    currentValue = situation[currentQuestion]

  const onChange = (value) => {
    const encodedSituation = encodeSituation(
      {
        ...situation,
        [question]: value == undefined ? undefined : value,
      },
      false,
      answeredQuestions,
    )

    console.log('on change')

    setSearchParams(encodedSituation, 'push', false)
  }

  const InputComponent = () => (
    <Input
      type={'number'}
      placeholder={evaluation.nodeValue}
      value={currentValue == null ? '' : currentValue}
      name={question}
      unit={evaluation.unit}
      onChange={onChange}
    />
  )
  return (
    <div>
      <Section>
        <InputSwitch
          {...{
            rules,
            currentQuestion,
            situation,
            answeredQuestions,
            setSearchParams,
            engine,
            nextQuestions,
            searchParams,
          }}
        />
      </Section>
    </div>
  );
      // <div
      //   css={`
      //     text-align: right;
      //   `}
      // >
      //   { <Prime
      //     value={formatValue(
      //       engine.setSituation(situation).evaluate(dottedName + ' . montant'),
      //     )}
      //   /> }
      // </div>
}
