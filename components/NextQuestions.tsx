import css from './css/convertToJs'

export default function NextQuestions({ nextQuestions, rules }) {
  return nextQuestions.length ? (
    <div
      style={css`
        margin-top: 1rem;
      `}
    >
      <h3>À suivre</h3>
      <div
        style={css`
          overflow: scroll;
          height: 2rem;
          width: 100%;
          white-space: nowrap;
        `}
      >
        <ol
          style={css`
            display: flex;
          `}
        >
          {nextQuestions.slice(1).map((question) => (
            <li
              style={css`
                width: auto;
                margin-right: 2rem;
              `}
              key={question}
            >
              <small>{rules[question].titre}</small>
            </li>
          ))}
        </ol>
      </div>
    </div>
  ) : (
    <p
      style={css`
        margin: 1rem 0;
      `}
    >
      ⭐️ Vous avez terminé.
    </p>
  )
}
