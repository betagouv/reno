'use client'
import { styled } from 'styled-components'
import css from './css/convertToJs'
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
          <Li key={el.lettre} $selected={el.lettre === letter}>
            <Bar
              $background={el.couleur}
              $index={index}
              $selected={el.lettre === letter}
              $selected2={el.lettre === newLetter}
            >
              {el.lettre}
            </Bar>
            <Triangle
              background={el.couleur}
              selected={el.lettre === letter}
              selected2={el.lettre === newLetter}
            />
          </Li>
        ))}
      </ul>
    </Bars>
  )
}

const Bars = styled.div`
  ul {
    list-style-type: none;
    padding-left: 0;
  }
`
const size = '2.2rem'
const Li = styled.li`
  display: flex;
  align-items: center;
  svg {
    width: ${size};
    height: ${size};
  }
`
const Bar = styled.div`
  background: ${(p) => p.$background};
  width: ${(p) => 2 + (p.$index + 1) * 1.5}rem;
  margin: 0.2rem 0;
  padding-left: 0.6rem;
  color: white;
  font-weight: bold;
  height: ${size};
  font-size: 150%;
  border: ${(p) =>
    p.$selected
      ? `2px solid black`
      : p.$selected2
        ? `2px dashed black`
        : `none`};
  border-right: none;
  z-index: 1;
  line-height: ${size};
  ${(p) =>
    p.$selected &&
    `
	  font-size: 180%;
  text-shadow: 1px 2px 4px black;

  `}
`

const Triangle = ({ background, selected, selected2 }) => (
  <svg
    viewBox="0 0 400 400"
    style={css(`

  margin-left: -1px
		  `)}
  >
    <polygon
      points="0,0 180,200 0,400"
      style={css(`

  fill: ${background};
  ${
    selected
      ? `
  stroke-width: 20px;
  stroke: black;
  `
      : selected2
        ? `
  stroke-width: 20px;
  stroke-dasharray: 55;
  stroke: black;

		  `
        : ``
  }

  
		  `)}
    />
  </svg>
)
