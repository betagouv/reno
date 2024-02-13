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

  const sendRequest = useCallback((value) => {
    // send value to the backend
    // useCallback to not get an infinite loop
    serverOnChange(value)
  }, [])

  useEffect(() => {
    setState(value)
  }, [value, setState])

  // now send request is debounced
  const [debouncedSendRequest] = useDebounce(sendRequest, 500)

  // onChange is not debounced anymore, it just calls debounced function
  const onChange = (e) => {
    console.log('vava2', e.target.value)
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
    <span>
      <input
        autoFocus={autoFocus}
        type="number"
        value={state}
        onChange={onChange}
        {...props}
      />
      &nbsp;{pluralUnit}
    </span>
  )
}
