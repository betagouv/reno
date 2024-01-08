'use client'
import { styled } from 'styled-components'
import data from './DPE.yaml'
export default function DPE({ letter, newLetter }) {
  /*
		 *
- énergie: 420
  climat: 100
  couleur: '#d7221f'
  lettre: G
		 * */

  const found = data.find((el) => el.letter === letter)
  return (
    <Bars>
      <ul>
        {data.map((el, index) => (
          <li key={el.lettre}>
            <Bar
              $background={el.couleur}
              $index={index}
              $selected={el.lettre === letter}
            >
              {el.lettre}
            </Bar>
          </li>
        ))}
      </ul>
    </Bars>
  )
}

const Bars = styled.div`
  ul {
    list-style-type: none;
  }
`
const Bar = styled.div`
  background: ${(p) => p.$background};
  width: ${(p) => 3 + p.$index * 1.5}rem;
  margin: 0.4rem 0;
  padding-left: 0.6rem;
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
  color: white;
  font-weight: bold;
  height: 2.2rem;
  font-size: 150%;
  border: 3px solid ${(p) => (p.$selected ? 'black' : 'transparent')};
`
