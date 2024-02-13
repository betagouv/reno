import css from './css/convertToJs'
import { getRuleName } from './publicodes/utils'
import { Card } from './UI'

export default function NextQuestions({
  nextQuestions,
  currentQuestion,
  rules,
}) {
  console.log({ nextQuestions })
  return nextQuestions.length ? (
    <div
      style={css`
        margin-top: 0.4rem;
        display: flex;
        align-items: center;
        color: #555;
      `}
    >
      <small
        style={css`
          width: 10rem;
          margin: 0;
        `}
      >
        {nextQuestions.length === 1 && nextQuestions[0] === currentQuestion
          ? `Dernière question`
          : `À suivre :`}
      </small>
      <div
        style={css`
          overflow: scroll;
          height: 1.8rem;
          width: 100%;
          white-space: nowrap;
          padding-top: 0.1rem;
        `}
      >
        <ol
          style={css`
            display: flex;
            list-style-type: none;
          `}
        >
          {nextQuestions.slice(1).map((question) => (
            <li
              style={css`
                padding-right: 0.6vw;
              `}
              key={question}
            >
              <small>{rules[question].titre || getRuleName(question)}</small>
              <small
                style={css`
                  padding-left: 0.6vw;
                `}
              >
                -
              </small>
            </li>
          ))}
        </ol>
      </div>
    </div>
  ) : (
    <Card
      style={css`
        margin: 1rem 0;
        text-align: center;
        padding: 1.6rem 0;
      `}
    >
      ⭐️ Vous avez terminé.
    </Card>
  )
}
