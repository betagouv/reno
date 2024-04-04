import { styled } from 'styled-components'

// If needed, use a more advanced component that handles non boolean and nested propositions like https://github.com/laem/futureco/blob/master/components/conversation/Question.tsx
export default function BinaryQuestion({ value, onChange }) {
  console.log('value')
  return (
    <div>
      <Label>
        <input
          type="radio"
          name={'oui'}
          value={'oui'}
          onChange={(evt) => onChange(evt.target.value)}
          checked={value === 'oui'}
        />
        <span>Oui</span>
      </Label>
      <Label>
        <input
          type="radio"
          name={'non'}
          value={'non'}
          onChange={(evt) => onChange(evt.target.value)}
          checked={value === 'non'}
        />
        <span>Non</span>
      </Label>
    </div>
  )
}

const Label = styled.label`
  cursor: pointer;
  margin-right: 0.6rem;
  input {
    cursor: pointer;
    margin: 0 0.2rem;
  }
  display: flex;
  align-items: center;
  margin-bottom: 0.6rem;
  > input + span {
    margin-left: 0.6rem;
  }
`
