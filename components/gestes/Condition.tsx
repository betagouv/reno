import Image from 'next/image'
export default function Condition({ questions, situation }) {
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

  console.log('beige', questions, situation)

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
        src={
          valid ? '/check.svg' : trigger ? `/attention.svg` : '/information.svg'
        }
        width="10"
        height="10"
        alt="Icône d'information"
      />
      <p>
        Pour bénéficier de la prime sur l'audit énergétique, les gestes
        d'isolation, de ventilation et de dépose de cuve à fioul,{' '}
        <strong>
          vous devrez choisir au moins un geste de remplacement de chauffage ou
          eau chaude sanitaire
        </strong>
        .
      </p>
    </div>
  )
}
