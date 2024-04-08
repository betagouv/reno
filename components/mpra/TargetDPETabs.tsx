import { useMediaQuery } from 'usehooks-ts'
import DPELabel from '../DPELabel'
import { Value } from '../ScenariosSelector'
import { encodeSituation } from '../publicodes/situationUtils'
import data from '@/components/DPE.yaml'

export default function TargetDPETabs({
  oldIndex,
  setSearchParams,
  answeredQuestions,
  choice,
  engine,
  situation,
}) {
  const isMobile = useMediaQuery('(max-width: 800px)')

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
          <em></em>
        </small>
      </p>
      <nav>
        <ol
          css={`
            display: flex;
            justify-content: start;
            list-style-type: none;
            input {
              display: none;
            }
            li  {
              padding: 0.4rem;
              margin: 0.1rem;
              background: #e4e7e7;
              border: 1px solid #aaa;
              border-top-right-radius: 0.3rem;
              border-top-left-radius: 0.3rem;

              cursor: pointer;
              label {
                cursor: pointer;
                font-size: 130%;
              }
            }
          `}
        >
          {possibilities.map((el, index) => (
            <li
              key={el.lettre}
              css={
                choice === index
                  ? `background: white !important; border-bottom: none !important`
                  : ``
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
                <DPELabel index={index} />
              </label>
            </li>
          ))}
        </ol>
      </nav>
    </section>
  )
}
