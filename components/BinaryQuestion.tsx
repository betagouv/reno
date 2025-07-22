// If needed, use a more advanced component that handles non boolean and nested propositions like https://github.com/laem/futureco/blob/master/components/conversation/Question.tsx
export default function BinaryQuestion({ value, onChange }) {
  return (
    <>
      <div className="fr-fieldset__element">
        <div className="fr-radio-group fr-radio-rich">
          <input
            type="radio"
            name="radio"
            id="radio-oui"
            value="oui"
            checked={'oui' === value}
            onChange={() => onChange('oui')}
          />
          <label className="fr-label" htmlFor="radio-oui">
            Oui
          </label>
        </div>
      </div>
      <div className="fr-fieldset__element">
        <div className="fr-radio-group fr-radio-rich">
          <input
            type="radio"
            name="radio"
            id="radio-non"
            value="non"
            checked={'non' === value}
            onChange={() => onChange('non')}
          />
          <label className="fr-label" htmlFor="radio-non">
            Non
          </label>
        </div>
      </div>
    </>
  )
}
