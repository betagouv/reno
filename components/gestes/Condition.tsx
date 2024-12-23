import Image from 'next/image'

export function computeConditionValue(questions, situation) {
  const isConditionedQuestion = (question) =>
    question.startsWith('gestes . isolation') ||
    question.startsWith('gestes . ventilation') ||
    question.startsWith('gestes . recommandés . audit') ||
    question.startsWith('gestes . chauffage . fioul')

  const trigger = questions.some(
    ([question]) =>
      isConditionedQuestion(question) && situation[question] === 'oui',
  )
  const valid = questions.some(
    ([question]) =>
      !isConditionedQuestion(question) && situation[question] === 'oui',
  )

  return valid ? true : trigger ? false : null
}

export default function Condition({ conditionValue }) {
  const valid = conditionValue
  const trigger = conditionValue === false
  return (
    <div
      css={`
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        p {
          width: 80%;
          border-left: 3px solid var(--lighterColor);
          padding-left: 0.6rem;
        }
        img {
          width: 2rem;
          height: auto;
          margin-right: 1rem;
        }
        margin-top: 3vh;
        strong {
          font-weight: normal;
          text-decoration: underline;
          ${valid
            ? `text-decoration: underline; text-decoration-color: #297254;`
            : trigger &&
              `text-decoration: underline; text-decoration-color: salmon;`}
          text-decoration-thickness: 2px;
        }
      `}
    >
      <Image
        src={'/information.svg'}
        width="10"
        height="10"
        alt="Icône d'information"
      />
      <p>
        Pour une rénovation efficace, il est conseillé de combiner isolation,
        ventilation et décarbonation du chauffage.
      </p>
    </div>
  )
}
