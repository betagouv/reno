'use client'
import { useCallback, useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { serializeUnit } from 'publicodes'

export default function Input({
  onChange: serverOnChange,
  value,
  unit,
  autoFocus = true,
  ...props
}) {
  const [state, setState] = useState(value)

  const sendRequest = useCallback(
    (value) => {
      // send value to the backend
      // useCallback to not get an infinite loop
      serverOnChange(value)
    },
    [serverOnChange],
  )

  useEffect(() => {
    setState(value)
  }, [value, setState])

  // now send request is debounced
  const [debouncedSendRequest] = useDebounce(sendRequest, 500)

  // onChange is not debounced anymore, it just calls debounced function
  const onChange = (e) => {
    const value = e.target.value

    // state is updated on every value change, so input will work
    setState(value)

    // call debounced request here
    debouncedSendRequest(value === '' ? undefined : value)
  }

  const serializedUnit = serializeUnit(unit)
  const pluralUnit =
    serializedUnit === 'personne' && value > 1 ? 'personnes' : serializedUnit

  return (
    <div className="fr-fieldset__element">
      <div
        className="fr-input-group"
        css={`
          display: flex;
          align-items: center;
        `}
      >
        <input
          autoFocus={autoFocus}
          className="fr-input"
          spellCheck="false"
          id={props.id}
          type="number"
          value={state}
          onChange={onChange}
          min="1"
          {...props}
        />
        <div>&nbsp;{pluralUnit}</div>
      </div>
    </div>
  )
}
