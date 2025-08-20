'use client'
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
  return (
    <>
      {avecLegend && (
        <>
          <h3>Classe Energétique</h3>
          <p>Consommation d'énergie</p>
        </>
      )}
      {data.map((el, index) => (
        <div className="fr-fieldset__element" key={el.lettre}>
          <div className="fr-radio-group">
            {onClick && (
              <input
                type="radio"
                id={`radio-${el.lettre}`}
                checked={el.lettre === letter}
                onChange={() => onClick && onClick(index)}
              />
            )}
            <Bar
              htmlFor={`radio-${el.lettre}`}
              background={el.couleur}
              index={index}
              selected={el.lettre === letter}
            >
              {el.lettre}{' '}
              {avecLegend && (
                <small>
                  {index === 0
                    ? '<= ' + data[index + 1].énergie
                    : index === 6
                      ? '> ' + el.énergie
                      : el.énergie + 1 + ' à ' + data[index + 1].énergie}
                </small>
              )}
            </Bar>
          </div>
        </div>
      ))}
      {avecLegend && <small>en kWhEP/m².an</small>}
      {avecGES && (
        <>
          <h3>Classe GES</h3>
          <p>Emissions de gaz à effet de serre</p>
          {data.map((el, index) => (
            <div className="fr-fieldset__element" key={el.lettre}>
              <div
                className="fr-radio-group"
                onClick={() => onClick && onClick(index)}
              >
                {onClick && (
                  <input
                    type="radio"
                    id={`radio-${el.lettre}`}
                    checked={el.lettre === gesLetter}
                  />
                )}
                <Bar
                  htmlFor={`radio-${el.lettre}`}
                  background={el['couleur GES']}
                  index={index}
                  selected={el.lettre === gesLetter}
                  selected2={el.lettre === newLetter}
                >
                  {el.lettre}{' '}
                  <small>
                    {index === 0
                      ? '<= ' + data[index + 1].climat
                      : index === 6
                        ? '> ' + el.climat
                        : el.climat + 1 + ' à ' + data[index + 1].climat}
                  </small>
                </Bar>
              </div>
            </div>
          ))}
          <small>en kgeqCO²/m².an</small>
        </>
      )}
    </>
  )
}

const Bar = ({ htmlFor, background, index, selected, children }) => (
  <label
    className="fr-label"
    css={`
      > span {
        background: ${background};
        width: ${3 + (index + 1.5) * 1.5}rem;
        color: white;
        text-shadow: 1px 2px 4px black;
        font-weight: bold;
        font-size: 120%;
        display: flex;
        align-items: center;
        height: 2rem;
        ${selected && `border: 2px solid var(--color);`}
        border-right: none;
        line-height: 1.6rem;
        padding-left: 0.5rem;
        position: relative;
        top: -0.2rem;
        small {
          font-size: 60%;
          white-space: nowrap;
          text-shadow: 1px 1px 2px black;
        }
      }
      &::after {
        content: '';
        position: absolute;
        right: -24px;
        top: -0.2rem;
        width: 24px;
        height: 2rem;
        background: ${background};
        clip-path: polygon(0 0, 100% 50%, 0 100%);
        z-index: -1;
        ${selected && `background: var(--color);`}
      }
    `}
    htmlFor={htmlFor}
  >
    <span>{children}</span>
  </label>
)
