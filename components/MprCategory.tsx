import rules from '@/app/règles/rules'
import GesteQuestion from './GesteQuestion'
import { BlocAide } from './UI'
import { formatValue } from 'publicodes'
import Badge from '@codegouvfr/react-dsfr/Badge'

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
  const positiveValue = primeIndividuelleObj.nodeValue > 0
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
              autoFocus: false,
            }}
          />
        ))}
        <div
          css={`
            justify-content: end;
            display: flex;
          `}
        >
          <Badge
            noIcon
            severity={!isExactTotal || !positiveValue ? '' : 'success'}
          >
            {positiveValue ? (
              <>
                Prime de{' '}
                {isExactTotal ? formatValue(primeIndividuelleObj) : '...'}
                par logement
              </>
            ) : (
              'Pas de prime'
            )}
          </Badge>
        </div>
      </div>
    </BlocAide>
  )
}
