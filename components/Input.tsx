import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

export default function Input({ onChange, value, ...props }) {
  const [state, setState] = useState(value)

  const [debouncedState] = useDebounce(state, 500)

  useEffect(() => {
    console.log('will call on change from useeffect', debouncedState)
    onChange(debouncedState)
  }, [debouncedState, onChange])

  return (
    <input
      autoFocus={true}
      type="number"
      value={state}
      onChange={(e) => {
        console.log('vava2', e.target.value)
        const value = e.target.value

        setState(value === '' ? undefined : value)
      }}
      {...props}
    />
  )
}
