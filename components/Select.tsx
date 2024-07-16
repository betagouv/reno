'use client'
import { useEffect, useState } from 'react'

export default function Select({
  onChange: serverOnChange,
  value,
  values,
  ...props
}) {
  const [state, setState] = useState(value)

  useEffect(() => {
    setState(value)
  }, [value, setState])

  // onChange is not debounced anymore, it just calls debounced function
  const onChange = (e) => {
    const value = e.target.value

    // state is updated on every value change, so input will work
    setState(value)
    serverOnChange(value === '' ? undefined : value)
  }

  return (
      <select
        css={`
            appearance: none;
            line-height: 1.5rem;
            padding: .5rem 2rem .5rem .5rem;
            box-shadow: inset 0 -2px 0 0 var(#3a3a3a);
            background-color:#eee;
            color: #3a3a3a;
            background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23161616' d='m12 13.1 5-4.9 1.4 1.4-6.4 6.3-6.4-6.4L7 8.1z'/%3E%3C/svg%3E");
            background-position: calc(100% - .5rem) 50%;
            background-repeat: no-repeat;
            background-size: 1rem 1rem;
            border-radius: .25rem .25rem 0 0;
        `}
        onChange={onChange}
        {...props}
      >
        {values.map((item, index) => (
            <option key={index} value={item.valeur} selected={state == item.valeur}>{item.titre}</option>
          )
        )}
      </select>
  )
}
