import { parse, parseInline } from 'marked'
export default function RadioQuestion({ name, onChange, value, rule, engine }) {
  const list = rule['une possibilité parmi'].possibilités

  return list.map((element, index) => {
    const questionParams = engine.getParsedRules()[name + ' . ' + element]
    const subTitle = questionParams.rawNode['sous-titre']

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
            {subTitle && (
              <span
                className="fr-hint-text"
                dangerouslySetInnerHTML={{
                  __html: subTitle?.includes('\n')
                    ? parse(subTitle)
                    : parseInline(subTitle),
                }}
              />
            )}
          </label>
        </div>
      </div>
    )
  })
}
