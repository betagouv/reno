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
      <label
        key={element}
        css={`
          cursor: pointer;
          display: flex;
          align-items: center;
          margin-bottom: 0.6rem;
          padding: calc(0.3rem + 0.7vw) calc(0.5rem + 1vw);
          border: 2px solid #dfdff1;
          border-radius: 0.3rem;
          &:hover,
          &:has(input:checked) {
            border: 2px solid #004396;
          }
        `}
      >
        <input
          css={`
            width: 1.4rem;
            height: 1.4rem;
            cursor: pointer;
            margin-right: 0.6rem;
          `}
          type="checkbox"
          name={element}
          value={element}
          checked={isChecked(element, situation, currentQuestion)}
          onChange={() =>
            handleCheck(element, situation, setSearchParams, currentQuestion)
          }
        />
        <span>{questionParams ? questionParams.title : element}</span>
      </label>
    )
  })
}
