import useIsInIframe from '@/components/useIsInIframe'
import styled from 'styled-components'

export default function ProgressBar({
  answeredQuestions: rawAnsweredQuestions,
  nextQuestions,
}) {
  const isInIframe = useIsInIframe()
  const answeredQuestions = rawAnsweredQuestions.filter(
    (el) =>
      ![
        'simulation . mode',
        'ménage . code région',
        'ménage . code département',
      ].includes(el),
  )

  // Dans le cas du simulateur principale, on considère que le questionnaire s'arrête au moment du choix du parcours d'aide
  const nbQuestionTotal =
    answeredQuestions.indexOf("parcours d'aide") !== -1
      ? answeredQuestions.indexOf("parcours d'aide")
      : answeredQuestions.length +
        (nextQuestions.indexOf("parcours d'aide") !== -1
          ? nextQuestions.indexOf("parcours d'aide")
          : nextQuestions.length)

  const indexQuestionActuel = answeredQuestions.length + 1

  return (
    <ProgressBarStyle
      $ratio={Math.min(indexQuestionActuel / nbQuestionTotal, 1)}
      $isInIframe={isInIframe}
    >
      <div></div>
    </ProgressBarStyle>
  )
}

const ProgressBarStyle = styled.div`
  height: 0.4rem;
  width: 100%;
  background: #e8edff;
  margin-bottom: 1rem;
  > div {
    background: var(--color);

    border-radius: ${(p) => (p.$ratio == 1 ? '0' : '0.25rem')};
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    width: ${(p) => p.$ratio * 100}%;
    height: 100%;
    transition: width 1s ease-in-out;
  }
`
