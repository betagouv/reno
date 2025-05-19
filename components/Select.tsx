'use client'
import { useEffect, useState } from 'react'

export default function Select({
  onChange: serverOnChange,
  value,
  values,
  disableInstruction = true,
  ...props
}) {
  const [state, setState] = useState(value)
  useEffect(() => {
    setState(value)
  }, [value, setState])

  const onChange = (e) => {
    const value = e.target.value

    setState(value)
    serverOnChange(value)
  }

  return (
    <select
      css={`
        appearance: none;
        height: 2.4rem;
        line-height: 1.5rem;
        padding: 0.5rem 2rem 0.5rem 0.5rem;
        border: none;
        background-color: rgb(245, 245, 254);
        color: #3a3a3a;
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23161616' d='m12 13.1 5-4.9 1.4 1.4-6.4 6.3-6.4-6.4L7 8.1z'/%3E%3C/svg%3E");
        background-position: calc(100% - 0.5rem) 50%;
        background-repeat: no-repeat;
        background-size: 1rem 1rem;
        border-radius: 0.25rem 0.25rem 0 0;
        border-bottom: 2px solid var(--color);
        box-shadow:
          rgba(0, 0, 0, 0.12) 0px 1px 1px 0px,
          rgba(61, 59, 53, 0.16) 0px 0px 0px 1px,
          rgba(61, 59, 53, 0.08) 0px 2px 5px 0px;
      `}
      onChange={onChange}
      {...props}
      value={value}
    >
      {[{ valeur: '', titre: 'Choisir une réponse' }, ...values].map(
        (item, index) => (
          <option
            key={index}
            value={item.valeur}
            disabled={disableInstruction && item.valeur === ''}
          >
            {item.titre}
          </option>
        ),
      )}
    </select>
  )
}
