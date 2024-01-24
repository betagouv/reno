import { useCallback, useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

export default function Input({ onChange, value, ...props }) {
  const [state, setState] = useState(value)
  const [debouncedState] = useDebounce(state, 500)

  useEffect(() => {
    onChange(debouncedState)
  }, [debouncedState, onChange])

  return (
    <input
      type="number"
      value={state}
      onChange={(e) => {
        setState(e.target.value)
      }}
      {...props}
    />
  )
}
