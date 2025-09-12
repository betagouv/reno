import { encodeDottedName } from './publicodes/situationUtils'

const handleCheck = (value, situation, setSearchParams, rule) => {
  let checkboxes =
    Object.keys(situation).filter((k) => k.startsWith(rule) && k !== rule) || []

  const isAlreadyChecked = checkboxes.includes(rule + ' . ' + value)
  if (isAlreadyChecked) {
    checkboxes = checkboxes.filter((c) => c != rule + ' . ' + value)
  } else {
    checkboxes.push(rule + ' . ' + value)
  }

  setSearchParams(
    {
      [encodeDottedName(rule + '.' + value)]: !isAlreadyChecked
        ? 'oui'
        : undefined,
      [encodeDottedName(rule)]: checkboxes.length > 0 ? 'oui' : undefined,
    },
    'push',
    false,
  )
}

export default function CheckboxQuestion({
  currentQuestion,
  rule,
  engine,
  setSearchParams,
  situation,
}) {
  return rule.possibilités.map((element, index) => {
    const questionParams =
      engine.getParsedRules()[currentQuestion + ' . ' + element]
    return (
      <div className="fr-fieldset__element" key={index}>
        <div className="fr-custom-checkbox-group fr-checkbox-rich">
          <input
            type="checkbox"
            name="checkbox"
            id={`checkbox-${index}`}
            aria-describedby={`checkbox-${index}-messages`}
            checked={situation[currentQuestion + ' . ' + element] == 'oui'}
            onChange={() =>
              handleCheck(element, situation, setSearchParams, currentQuestion)
            }
          />
          <label className="fr-label" htmlFor={`checkbox-${index}`}>
            {questionParams ? questionParams.title : element}
          </label>
        </div>
      </div>
    )
  })
}
