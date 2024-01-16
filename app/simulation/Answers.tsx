import css from '@/components/css/convertToJs'
import Link from '@/node_modules/next/link'
import styled from 'styled-components'
import simulationConfig from '@/app/simulation/simulationConfig.yaml'
import NextQuestions from '@/components/NextQuestions'

export default function Answers({
  answeredQuestions: rawAnsweredQuestions,
  nextQuestions,
  currentQuestion,
  rules,
  situation,
}) {
  console.log({ rawAnsweredQuestions })
  const answeredQuestions = rawAnsweredQuestions.filter(
    (el) => el !== 'simulation . mode',
  )
  const category = currentQuestion.split(' . ')[0]
  const categories = simulationConfig.catégories
  const categoryIndex = categories.findIndex((el) => el === category) + 1,
    categoryName = rules[category].titre
  console.log({ category, categories, categoryIndex })
  return (
    <Wrapper>
      {answeredQuestions.length > 0 && (
        <Header>
          {' '}
          <small>
            Étape {categoryIndex} sur {categories.length}
          </small>
          <Link href={'/simulation'}>Recommencer</Link>
        </Header>
      )}
      <Details>
        <summary>
          <Number>{categoryIndex}</Number> {categoryName}
        </summary>
        <h2>Vos réponses</h2>
        <AnswerList>
          {answeredQuestions.map((answer) => (
            <li key={answer}>
              {' '}
              <span>{rules[answer].titre}</span> -{' '}
              <span>{situation[answer]}</span>
            </li>
          ))}
        </AnswerList>
      </Details>
      <ProgressBar $ratio={categoryIndex / categories.length} />
      <NextQuestions {...{ nextQuestions, rules }} />
    </Wrapper>
  )
}

const AnswerList = styled.ol`
  margin: 0.6rem 0;
`

const Wrapper = styled.section`
  margin-bottom: 2vh;
`
const Details = styled.details`
  h2 {
    margin-top: 0.6rem;
  }
  padding-bottom: 1.4vh;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.2vh;
  align-items: center;
  > small {
    color: #555;
  }
`

const Number = styled.span`
  background: #000093;
  border-radius: 1rem;
  width: 1.4rem;
  display: inline-block;
  text-align: center;
  height: auto;
  color: white;
`

const ProgressBar = styled.div`
  height: 0.4rem;
  background: #000093;
  border-radius: 0.25rem;
  width: ${(p) => p.$ratio * 100}%;
`
