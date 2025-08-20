'use client'
import { useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'

export default function SegmentedControl({
  onChange: serverOnChange,
  value,
  name,
  options = ['oui', 'non'],
  ...props
}) {
  const [state, setState] = useState(value)

  useEffect(() => {
    setState(value)
  }, [value, setState])

  const onChange = (value) => {
    setState(value)

    serverOnChange(value)
  }
  const uniqueId = uuid()
  return options.map((option, index) => (
    <div
      className="fr-fieldset__element fr-fieldset__element--inline"
      key={index}
    >
      <div className="fr-radio-group fr-radio-rich">
        <input
          type="radio"
          name="radio"
          id={uniqueId + option}
          value={option}
          checked={option === value}
          onChange={() => {
            onChange(option)
          }}
        />
        <label className="fr-label" htmlFor={uniqueId + option}>
          {option}
        </label>
      </div>
    </div>
  ))
}
