import dpeValues from '@/components/dpe/DPE.yaml'
import DPELabel from '../dpe/DPELabel'
import { encodeSituation } from '../publicodes/situationUtils'
import { push } from '@socialgouv/matomo-next'

export default function TargetDPETabs({
  oldIndex,
  setSearchParams,
  answeredQuestions,
  choice,
  situation,
  text = 'DPE visé',
  columnDisplay,
}) {
  const possibilities = dpeValues.filter((el, index) => index <= oldIndex - 2)

  const doSetSearchParams = (value) => {
    push(['trackEvent', 'Module', 'Interaction', 'DPE visé ' + value])
    setSearchParams(
      encodeSituation({
        'projet . DPE visé': value + '*',
      }),
      'replace',
      false,
    )
  }
  return (
    <div
      css={`
        display: flex;
        align-items: center;
        ${columnDisplay && 'flex-direction: column; align-items: baseline;'}
        gap: 0.5rem;
      `}
    >
      {text != '' && <div>{text}&nbsp;:</div>}
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
                  onChange={() => doSetSearchParams(index + 1)}
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
