'use client'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'

// Style repris du design système FR pour le composant contrôle segmenté
// https://www.systeme-de-design.gouv.fr/composants-et-modeles/composants/controle-segmente
const HiddenInput = styled.input`
    opacity: 0;
    height: 100%;
    margin: 0;
    position: absolute;
    width: 100%;
    z-index: -1;
    &:checked+label {
        box-shadow: inset 0 0 0 1px var(--color);
        color: var(--color);
    }
    &:not(:checked)+label {
        -webkit-mask-image: linear-gradient(0deg,#fff,#fff),linear-gradient(0deg,#fff,#fff),url("data:image/svg+xml;charset=uft8,<svg xmlns='http://www.w3.org/2000/svg' width='4px' height='4px' viewBox='0 0 4 4'><circle fill='%23fff' r='2' cx='2' cy='2' /></svg>"),url("data:image/svg+xml;charset=uft8,<svg xmlns='http://www.w3.org/2000/svg' width='4px' height='4px' viewBox='0 0 4 4'><circle fill='%23fff' r='2' cx='2' cy='2' /></svg>"),url("data:image/svg+xml;charset=uft8,<svg xmlns='http://www.w3.org/2000/svg' width='4px' height='4px' viewBox='0 0 4 4'><circle fill='%23fff' r='2' cx='2' cy='2' /></svg>"),url("data:image/svg+xml;charset=uft8,<svg xmlns='http://www.w3.org/2000/svg' width='4px' height='4px' viewBox='0 0 4 4'><circle fill='%23fff' r='2' cx='2' cy='2' /></svg>");
        mask-image: linear-gradient(0deg,#fff,#fff),linear-gradient(0deg,#fff,#fff),url("data:image/svg+xml;charset=uft8,<svg xmlns='http://www.w3.org/2000/svg' width='4px' height='4px' viewBox='0 0 4 4'><circle fill='%23fff' r='2' cx='2' cy='2' /></svg>"),url("data:image/svg+xml;charset=uft8,<svg xmlns='http://www.w3.org/2000/svg' width='4px' height='4px' viewBox='0 0 4 4'><circle fill='%23fff' r='2' cx='2' cy='2' /></svg>"),url("data:image/svg+xml;charset=uft8,<svg xmlns='http://www.w3.org/2000/svg' width='4px' height='4px' viewBox='0 0 4 4'><circle fill='%23fff' r='2' cx='2' cy='2' /></svg>"),url("data:image/svg+xml;charset=uft8,<svg xmlns='http://www.w3.org/2000/svg' width='4px' height='4px' viewBox='0 0 4 4'><circle fill='%23fff' r='2' cx='2' cy='2' /></svg>");
        -webkit-mask-position: .25rem .375rem,.375rem .25rem,.25rem .25rem,calc(100% - .25rem) .25rem,.25rem calc(100% - .25rem),calc(100% - .25rem) calc(100% - .25rem);
        mask-position: .25rem .375rem,.375rem .25rem,.25rem .25rem,calc(100% - .25rem) .25rem,.25rem calc(100% - .25rem),calc(100% - .25rem) calc(100% - .25rem);
        -webkit-mask-repeat: no-repeat;
        mask-repeat: no-repeat;
        -webkit-mask-size: calc(100% - .5rem)calc(100% - .75rem),calc(100% - .75rem)calc(100% - .5rem),.25rem .25rem,.25rem .25rem,.25rem .25rem,.25rem .25rem;
        mask-size: calc(100% - .5rem)calc(100% - .75rem),calc(100% - .75rem)calc(100% - .5rem),.25rem .25rem,.25rem .25rem,.25rem .25rem,.25rem .25rem;
    }
    &:not(:checked)+label:hover {
        background-color: #F6F6F6;
        cursor: pointer;
    }
`;

const SegmentedLabel = styled.label`
    max-height: none;
    max-width: 100%;
    min-height: 2rem;
    overflow: visible;
    overflow: initial;
    padding: .25rem .75rem;
    font-size: 1rem;
    line-height: 1.5rem;
    min-height: 2.5rem;
    padding: .5rem 1rem;
    overflow: initial;
    max-width: 100%;
    max-height: none;
    width: 100%;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    border-radius: .25rem;
    white-space: nowrap;
`;

export default function SegmentedControl({
  onChange: serverOnChange,
  value,
  name,
  options = ["oui", "non"],
  ...props
}) {
  const [state, setState] = useState(value)

  useEffect(() => {
    setState(value)
  }, [value, setState])

  const onChange = (e) => {
    const value = e.target.value
    // state is updated on every value change, so input will work
    setState(value)

    serverOnChange(value)
  }
  const uniqueId = uuid();
  return (
    <fieldset>
        <div css={`
                border-radius: .25rem;
                box-shadow: inset 0 0 0 1px #ddd;
                display: flex;
                flex-direction: row;
            `}>
            {options.map((option) => (
                <div key={option} css={`position: relative;`}>
                    <HiddenInput
                        value={option}
                        type="radio"
                        id={uniqueId+option}
                        checked={option === value}
                        onChange={onChange}
                    />
                    <SegmentedLabel htmlFor={uniqueId+option}>{option}</SegmentedLabel>
                </div>
            ))}
        </div>
    </fieldset>
  )
}