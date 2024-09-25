import rules from '@/app/règles/rules'
import GesteQuestion from './GesteQuestion'
import { BlocAide, PrimeStyle } from './UI'
import { formatValue } from 'publicodes'

export default function MprCategory({
  engine,
  situation,
  setSearchParams,
  answeredQuestions,
}) {
  const questions = [
    'ménage . commune',
    'ménage . personnes',
    'ménage . revenu',
  ]
  const primeIndividuelleObj = engine
    .setSituation(situation)
    .evaluate('copropriété . prime individuelle')
  const isExactTotal =
    Object.keys(primeIndividuelleObj.missingVariables).length === 0
  return (
    <BlocAide>
      <div className="aide-header">
        <div>
          <h3>Prime individuelle MaPrimeRénov' Copropriété</h3>
        </div>
      </div>
      <div className="aide-details">
        {questions.map((question, idx) => (
          <GesteQuestion
            key={idx}
            {...{
              rules,
              question,
              engine,
              situation,
              setSearchParams,
              answeredQuestions,
            }}
          />
        ))}
        <div
          css={`
            justify-content: end;
            display: flex;
          `}
        >
          <PrimeStyle
            css={`
              padding: 0.75rem;
            `}
            $inactive={!isExactTotal}
          >
            Prime de{' '}
            <strong
              css={`
                font-size: 1.5rem;
              `}
            >
              {isExactTotal ? formatValue(primeIndividuelleObj) : '...'}
            </strong>
            {primeIndividuelleObj.nodeValue !== 0 ? ' par logement' : ''}
          </PrimeStyle>
        </div>
      </div>
    </BlocAide>
  )
}
