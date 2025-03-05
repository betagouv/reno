import dpeValues from '@/components/DPE.yaml'
import DPELabel from '../DPELabel'
import { encodeSituation } from '../publicodes/situationUtils'

export default function TargetDPETabs({
  oldIndex,
  setSearchParams,
  answeredQuestions,
  choice,
  situation,
  isMobile,
}) {
  const possibilities = dpeValues.filter((el, index) => index <= oldIndex - 2)

  const doSetSearchParams = (question, value) => {
    const newSituation = encodeSituation(
      {
        ...situation,
        [question]: value,
      },
      false,
      answeredQuestions,
    )
    setSearchParams(newSituation, 'push')
  }
  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      `}
    >
      <div>Votre DPE visé&nbsp;:</div>
      <nav>
        <ol
          css={`
            padding: 0;
            display: flex;
            list-style-type: none;
            input {
              display: none;
            }
            li  {
              margin: 0.1rem;
              label {
                cursor: pointer;
              }
            }
          `}
        >
          {possibilities.map((el, index) => (
            <li
              key={el.lettre}
              css={
                choice === index
                  ? 'border: 2px solid var(--color); border-radius: 0.4rem;'
                  : 'border: 2px solid transparent; opacity: 0.5'
              }
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
                <DPELabel index={index} small={false} />
              </label>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
