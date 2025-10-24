import DPELabel from '../dpe/DPELabel'
import Value from '@/components/Value'
import { encodeSituation } from '../publicodes/situationUtils'
import data from '@/components/dpe/DPE.yaml'
import useIsMobile from '../useIsMobile'

// this component was our first attempt to make a dedicated interface for the user to explain this law
// we're trying something even simpler, tabs. See TargetDPETabs
export default function TargetDPETable({
  oldIndex,
  setSearchParams,
  answeredQuestions,
  choice,
  engine,
  situation,
}) {
  const isMobile = useIsMobile()

  const possibilities = data.filter((el, index) => index <= oldIndex - 2)

  const doSetSearchParams = (question, value) => {
    const newSituation = encodeSituation(
      {
        ...situation,
        [question]: value,
      },
      false,
      answeredQuestions,
    )
    console.log('girafe', newSituation)
    setSearchParams(newSituation, 'push')
  }
  return (
    <section>
      <p
        css={`
          margin-top: 1.5vh;
          text-align: right;
          line-height: 1rem;
        `}
      >
        <small>
          <em> Sélectionnez une ligne pour évaluer votre budget. </em>
        </small>
      </p>
      <ol
        css={`
          margin-top: 1vh;
          list-style-type: none;
          padding: 0;
          border: 1px solid var(--lighterColor0);
          border-radius: 0.3rem;
          li {
            padding: 1.2rem 1vw;
            border-bottom: 1px solid var(--lighterColor0);
            label {
              display: flex;
              justify-content: space-evenly;
              cursor: pointer;
            }
          }
          li:first-child {
            background: var(--lightestColor);
            padding: 0.4rem 1vw;
            font-size: 90%;
            display: flex;
            justify-content: space-evenly;
          }
          li:last-child {
            margin-bottom: 0;
            border-bottom: none;
          }
        `}
      >
        <li key="en-tête">
          {isMobile ? <span>Choix</span> : <span>Votre choix</span>}
          <span>Sauts de DPE</span>
          <span>Aide</span>
          {isMobile ? (
            <span>Assiette max.</span>
          ) : (
            <span>Assiette maximum de l'aide</span>
          )}
        </li>
        {possibilities.map((el, index) => (
          <li
            key={el.lettre}
            css={choice === index ? `background: var(--lighterColor2)` : ``}
          >
            <label>
              <input
                css={`
                  width: 1.4rem;
                  height: 1.4rem;
                  cursor: pointer;
                  margin-right: 0.4rem;
                `}
                type="radio"
                name={index}
                checked={index === choice}
                onChange={() =>
                  doSetSearchParams('projet . DPE visé', index + 1)
                }
              />
              <span>
                <DPELabel index={oldIndex} />{' '}
                <span
                  css={`
                    position: relative;
                  `}
                >
                  <small
                    css={`
                      position: absolute;
                      left: 40%;
                      top: -0.3rem;
                      transform: translateX(-50%);
                      color: #555;
                      font-size: 70%;
                      line-height: 1rem;
                    `}
                  >
                    +{-index + oldIndex}
                  </small>
                  {'⟶ '}
                </span>
                <DPELabel index={index} />{' '}
              </span>
              <Value
                {...{
                  engine,
                  index,
                  situation: {
                    ...situation,
                    'projet . DPE visé': index + 1,
                  },
                  dottedName: 'MPR . accompagnée . pourcent',
                  state: 'none',
                }}
              />
              <Value
                {...{
                  engine,
                  index,
                  situation: {
                    ...situation,
                    'projet . DPE visé': index + 1,
                  },
                  dottedName: 'projet . travaux . plafond',
                  state: 'none',
                }}
              />
            </label>
          </li>
        ))}
      </ol>
    </section>
  )
}
