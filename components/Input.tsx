import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

export default function Input({ onChange, value, ...props }) {
  const [state, setState] = useState(value)

  // Debuggin
  //  const [debouncedState] = useDebounce(state, 2000)
  const debouncedState = state

  useEffect(() => {
    if (!debouncedState) return
    console.log('will call on change from useeffect', debouncedState)
    onChange(debouncedState)
  }, [debouncedState, onChange])

  return (
    <input
      autoFocus={true}
      type="number"
      value={state}
      onChange={(e) => {
        setState(e.target.value)
      }}
      {...props}
    />
  )
}
