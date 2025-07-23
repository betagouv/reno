'use client'
import { styled } from 'styled-components'
import css from '../css/convertToJs'
import data from './DPE.yaml'

export default function DPE({
  letter,
  newLetter,
  onClick = undefined,
  avecGES = false,
  avecLegend = false,
  gesLetter = undefined,
}) {
  /*
   * data's format
- énergie: 420
  climat: 100
  couleur: '#d7221f'
  lettre: G
*/

  return (
    <>
      {avecLegend && (
        <>
          <h3>Classe Energétique</h3>
          <p>Consommation d'énergie</p>
        </>
      )}
      {data.map((el, index) => (
        <div
          className="fr-fieldset__element"
          key={el.lettre}
          css={`
            .dpe-label {
              display: flex;
              align-items: center;
              color: white;
              font-weight: bold;
              padding: 10px;
              margin: 1px 0;
              clip-path: polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%);
            }

            .A {
              background: #007c59;
              width: 200px;
            }
            .B {
              background: #2dae72;
              width: 220px;
            }
            .C {
              background: #a8cf45;
              width: 240px;
            }
            .D {
              background: #ffe039;
              color: black;
              width: 260px;
            }
            .E {
              background: #ffb931;
              color: black;
              width: 280px;
            }
            .F {
              background: #f97b4c;
              width: 300px;
            }
            .G {
              background: #e60000;
              width: 320px;
            }
          `}
        >
          <div className="fr-radio-group fr-radio-rich">
            <input
              type="radio"
              name="radio"
              id={`radio-${index}`}
              value={el.lettre}
              checked={el.lettre === letter}
              onChange={() => onClick && onClick(index)}
            />
            <label className="fr-label fr-py-0" htmlFor={`radio-${index}`}>
              <span className={`dpe-label ${el.lettre}`}>
                {el.lettre}{' '}
                <span className="range">
                  {avecLegend && (
                    <small>
                      {index == 0
                        ? '<= ' + data[index + 1].énergie
                        : index == 6
                          ? '> ' + el.énergie
                          : el.énergie + 1 + ' à ' + data[index + 1].énergie}
                    </small>
                  )}
                </span>
              </span>
            </label>
          </div>
        </div>
      ))}
      {avecLegend && <small>en kWhEP/m².an</small>}

      {avecGES && (
        <ClasseWrapper>
          <h3>Classe GES</h3>
          <p>Emissions de gaz à effet de serre</p>
          {/* <Bars>
            <ul>
              {data.map((el, index) => (
                <Li key={el.lettre} $selected={el.lettre === gesLetter}>
                  {onClick && (
                    <input type="radio" checked={el.lettre === letter} />
                  )}
                  <Bar
                    $background={el['couleur GES']}
                    $index={index}
                    $selected={el.lettre === letter}
                    $selected2={el.lettre === newLetter}
                  >
                    {' '}
                    <span>
                      {el.lettre}{' '}
                      <small>
                        {index == 0
                          ? '<= ' + data[index + 1].climat
                          : index == 6
                            ? '> ' + el.climat
                            : el.climat + 1 + ' à ' + data[index + 1].climat}
                      </small>
                    </span>
                  </Bar>
                  <Triangle
                    background={el['couleur GES']}
                    selected={el.lettre === letter}
                    selected2={el.lettre === newLetter}
                  />
                </Li>
              ))}
            </ul>
          </Bars> */}
          <small>en kgeqCO²/m².an</small>
        </ClasseWrapper>
      )}
    </>
  )
}

const ClasseWrapper = styled.div`
  h3 {
    margin: 0;
  }
`

const size = '2.2rem'
const Li = styled.li`
  display: flex;
  align-items: center;
  svg {
    width: ${(p) => p.$size || size};
    height: ${(p) => p.$size || size};
  }
  input {
    margin-right: 0.6rem;
    cursor: pointer;
  }
`
const Bar = styled.label`
  background: ${(p) => p.$background};
  width: ${(p) => 3 + (p.$index + 1.5) * 1.5}rem;
  margin: 0.2rem 0;
  padding-left: 0.6rem;
  color: white;
  text-shadow: 1px 2px 4px black;
  display: flex;
  align-items: center;
  > span:first-child {
    font-weight: bold;
    font-size: 150%;
    line-height: ${(p) => p.$size || size};
  }
  small {
    font-size: 60%;
    white-space: nowrap;
    text-shadow: 1px 1px 2px black;
  }

  height: ${(p) => p.$size || size};
  border: ${(p) =>
    p.$selected
      ? `2px solid var(--color)`
      : p.$selected2
        ? `2px dashed var(--color)`
        : `none`};
  border-right: none;
  z-index: 1;
  line-height: 1.6rem;
  cursor: pointer;
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
  stroke: var(--color);
  `
      : selected2
        ? `
  stroke-width: 20px;
  stroke-dasharray: 55;
  stroke: var(--color);

		  `
        : ``
  }

  
		  `)}
    />
  </svg>
)
