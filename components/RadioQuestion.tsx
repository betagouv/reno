export default function RadioQuestion({
  situation,
  name,
  onChange,
  value,
  rule,
  engine,
}) {
  const list = rule['une possibilité parmi'].possibilités

  return list.map((element, index) => {
    const questionParams = engine.getParsedRules()[name + ' . ' + element]
    const subTitle = questionParams.rawNode['sous-titre']
    const precision = questionParams.rawNode['précision']
    return (
      <div className="fr-fieldset__element" key={index}>
        <div className="fr-radio-group fr-radio-rich">
          <input
            type="radio"
            name="radio"
            id={`radio-${index}`}
            value={element}
            checked={element === value}
            onChange={() => {
              onChange(element)
            }}
          />
          <label className="fr-label" htmlFor={`radio-${index}`}>
            {questionParams ? questionParams.title : element}
            {subTitle && <small className="fr-hint-text">{subTitle}</small>}
            {precision && (
              <span
                style={{ fontSize: '1rem', color: '#000091' }}
                className="fr-hint-text"
              >
                {precision}
              </span>
            )}
          </label>
        </div>
      </div>
    )
  })
}
