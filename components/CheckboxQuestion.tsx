import { encodeDottedName } from './publicodes/situationUtils'

const handleCheck = (value, situation, setSearchParams, rule) => {
  let checkboxes =
    situation[rule]?.split(',').map((t) => t.replaceAll('"', '')) || []
  if (checkboxes && checkboxes.includes(value)) {
    checkboxes = checkboxes.filter((checkbox) => checkbox != value)
  } else {
    checkboxes.push(value)
  }
  setSearchParams(
    {
      [encodeDottedName(rule)]: checkboxes.length
        ? `"${checkboxes.join(',')}"`
        : undefined,
    },
    'push',
    false,
  )
}

const isChecked = (value, situation, rule) => {
  let checkboxes =
    situation[rule]?.split(',').map((t) => t.replaceAll('"', '')) || []
  return checkboxes.includes(value)
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
        <div className="fr-checkbox-group fr-checkbox-rich">
          <input
            type="checkbox"
            name="checkbox"
            id={`checkbox-${index}`}
            aria-describedby={`checkbox-${index}-messages`}
            checked={isChecked(element, situation, currentQuestion)}
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
